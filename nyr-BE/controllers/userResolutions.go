package controllers

import (
	"context"
	"log"
	"net/http"
	"nyr/db"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func GetUserResolutions(c *gin.Context) {
	// Check if the user is logged in
	userId := c.GetString("user_id")
	if userId == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not logged in"})
		return
	}

	// Convert string user ID to ObjectID
	userObjectID, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		log.Printf("Error converting userId to ObjectID: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID"})
		return
	}

	// Get the resolutions collection
	resolutionsCollection := db.GetCollection("resolutions")

	// Query to get resolutions created by the logged-in user with like count, comment count, and user information
	cursor, err := resolutionsCollection.Aggregate(context.Background(), []bson.M{
		// Step 1: Match resolutions created by the logged-in user
		{
			"$match": bson.M{
				"user_id": userObjectID,
			},
		},
		// Step 2: Look up the "likes" collection to get the like count for each resolution
		{
			"$lookup": bson.M{
				"from":         "likes",
				"localField":   "_id",
				"foreignField": "r_id",
				"as":           "likes",
			},
		},
		// Step 3: Look up the "comments" collection to get the comment count for each resolution
		{
			"$lookup": bson.M{
				"from":         "comments",
				"localField":   "_id",
				"foreignField": "r_id",
				"as":           "comments",
			},
		},
		// Step 4: Project required fields including like count, comment count, tags, and user information
		{
			"$project": bson.M{
				"resolution":    1,
				"like_count":    bson.M{"$size": "$likes"},
				"comment_count": bson.M{"$size": "$comments"},
				"tags":          1,
				"user_id":       1,
				"created_at":    1,
				"updated_at":    1,
			},
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

	// Add `isLiked` field to indicate if the logged-in user liked each resolution
	for i := range resolutions {
		rID, ok := resolutions[i]["_id"].(primitive.ObjectID)
		if ok {
			likeFilter := bson.M{
				"user_id": userObjectID,
				"r_id":    rID,
			}

			// Use FindOne to check if the user has liked this resolution
			var userLike bson.M
			err := db.GetCollection("likes").FindOne(context.Background(), likeFilter).Decode(&userLike)
			if err != nil {
				if err == mongo.ErrNoDocuments {
					resolutions[i]["isLiked"] = false
				} else {
					log.Printf("Error checking user like: %v", err)
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check user likes"})
					return
				}
			} else {
				resolutions[i]["isLiked"] = true
			}
		}
	}

	// Return the resolutions created by the user
	c.JSON(http.StatusOK, gin.H{
		"resolutions": resolutions,
	})
}
