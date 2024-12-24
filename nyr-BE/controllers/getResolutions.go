package controllers

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"nyr/db"
	"strconv"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func GetResolutions(c *gin.Context) {
	// Check if the user is logged in
	isLoggedIn := false
	userId := c.GetString("user_id")
	if userId != "" {
		isLoggedIn = true
	}

	// Convert string user ID to ObjectID if logged in
	var userObjectID primitive.ObjectID
	var err error
	if isLoggedIn {
		userObjectID, err = primitive.ObjectIDFromHex(userId)
		if err != nil {
			log.Printf("Error converting userId to ObjectID: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID"})
			return
		}
	}

	// Get the page and limit query parameters
	page, err := strconv.Atoi(c.DefaultQuery("page", "1"))
	if err != nil {
		page = 1 // default to page 1 if no page parameter is provided or invalid
	}
	limit, err := strconv.Atoi(c.DefaultQuery("limit", "15"))
	if err != nil {
		limit = 6 // default to 6 items per page
	}

	// Calculate skip for pagination
	skip := (page - 1) * limit

	// Get the resolutions collection
	resolutionsCollection := db.GetCollection("resolutions")

	// Query to get resolutions with like count, comment count, and user information
	cursor, err := resolutionsCollection.Aggregate(context.Background(), []bson.M{
		// Step 1: Look up the "likes" collection to get the like count for each resolution
		{
			"$lookup": bson.M{
				"from":         "likes", // Join with the "likes" collection
				"localField":   "_id",   // Match the resolution ID (_id in resolutions)
				"foreignField": "r_id",  // Match with r_id in likes
				"as":           "likes", // Store the matched likes in a field named "likes"
			},
		},
		// Step 2: Look up the "comments" collection to get the comment count for each resolution
		{
			"$lookup": bson.M{
				"from":         "comments", // Join with the "comments" collection
				"localField":   "_id",      // Match the resolution ID (_id in resolutions)
				"foreignField": "r_id",     // Match with r_id in comments
				"as":           "comments", // Store the matched comments in a field named "comments"
			},
		},
		// Step 3: Look up the "users" collection to get the user's name
		{
			"$lookup": bson.M{
				"from":         "users",   // Join with the "users" collection
				"localField":   "user_id", // Match the user_id in resolutions
				"foreignField": "_id",     // Match with the _id in users
				"as":           "user",    // Store the matched user in a field named "user"
			},
		},
		// Step 4: Project required fields including like count, comment count, tags, and user information
		{
			"$project": bson.M{
				"resolution":    1,                                                      // Include the resolution field
				"like_count":    bson.M{"$size": "$likes"},                              // Count likes
				"comment_count": bson.M{"$size": "$comments"},                           // Count comments
				"tags":          1,                                                      // Include tags array
				"user_id":       1,                                                      // Include user_id to link the resolution to the user
				"created_at":    1,                                                      // Include created_at field
				"updated_at":    1,                                                      // Include updated_at field
				"user_name":     bson.M{"$arrayElemAt": []interface{}{"$user.name", 0}}, // Get the user's name
			},
		},
		// Step 5: Skip and Limit for pagination
		{
			"$skip": skip,
		},
		{
			"$limit": limit,
		},
	})

	if err != nil {
		log.Printf("Error during aggregation: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve resolutions"})
		return
	}
	defer cursor.Close(context.Background())

	// Parse the aggregation result into a slice of resolutions
	var resolutions []bson.M
	if err := cursor.All(context.Background(), &resolutions); err != nil {
		log.Printf("Error parsing aggregation result: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse result"})
		return
	}

	// If user is logged in, check if user has liked any resolution
	for i := range resolutions {
		rID, ok := resolutions[i]["_id"].(primitive.ObjectID)
		fmt.Println("r_id:", rID)
		if ok {
			// Query the "likes" collection to check if the logged-in user has liked this resolution
			likeFilter := bson.M{
				"user_id": userObjectID, // Match the logged-in user_id
				"r_id":    rID,          // Match the current resolution_id
			}

			// Use FindOne to check if the user has liked this resolution
			var userLike bson.M
			err := db.GetCollection("likes").FindOne(context.Background(), likeFilter).Decode(&userLike)
			if err != nil {
				// If no like document is found, the user has not liked this resolution
				if err == mongo.ErrNoDocuments {
					resolutions[i]["isLiked"] = false
				} else {
					log.Printf("Error checking user like: %v", err)
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check user likes"})
					return
				}
			} else {
				// If a like document is found, the user has liked this resolution
				resolutions[i]["isLiked"] = true
			}
		}
	}

	// Return the results along with pagination info
	c.JSON(http.StatusOK, gin.H{
		"resolutions": resolutions,
		"page":        page,
		"limit":       limit,
	})
}
