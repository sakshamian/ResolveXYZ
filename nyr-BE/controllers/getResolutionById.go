package controllers

import (
	"context"
	"log"
	"net/http"
	"nyr/db" // Import the db package to interact with MongoDB

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// GetResolutionByID handles fetching a resolution by its ID with the like count, comment count, all comments (with user names), and tags.
func GetResolutionByID(c *gin.Context) {
	// Get the resolution ID from the URL parameters
	resolutionID := c.Param("id")

	// Convert the string ID to a primitive.ObjectID
	resolutionObjectID, err := primitive.ObjectIDFromHex(resolutionID)
	if err != nil {
		log.Printf("Invalid resolution ID: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid resolution ID"})
		return
	}

	// Get the resolutions collection from the database
	resolutionsCollection := db.GetCollection("resolutions")

	// Aggregate pipeline to get the resolution with like count, comment count, all comments, user name, and tags
	aggPipeline := []bson.M{
		// Step 1: Match the resolution by ID
		{
			"$match": bson.M{
				"_id": resolutionObjectID, // Filter to match the resolution ID
			},
		},
		// Step 2: Look up the "likes" collection to get the like count for the resolution
		{
			"$lookup": bson.M{
				"from":         "likes", // Join with the "likes" collection
				"localField":   "_id",   // Match the resolution ID (_id in resolutions)
				"foreignField": "r_id",  // Match with r_id in likes
				"as":           "likes", // Store the matched likes in a field named "likes"
			},
		},
		// Step 3: Look up the "comments" collection to get all comments for the resolution
		{
			"$lookup": bson.M{
				"from":         "comments", // Join with the "comments" collection
				"localField":   "_id",      // Match the resolution ID (_id in resolutions)
				"foreignField": "r_id",     // Match with r_id in comments
				"as":           "comments", // Store the matched comments in a field named "comments"
			},
		},
		// Step 4: Look up the "users" collection to get the user's name who created the resolution
		{
			"$lookup": bson.M{
				"from":         "users",   // Join with the "users" collection
				"localField":   "user_id", // Match the user_id in the resolutions collection
				"foreignField": "_id",     // Match with the _id in the users collection
				"as":           "user",    // Store the matched user in a field named "user"
			},
		},
		// Step 5: Look up the "users" collection again to get the user's name for each comment
		{
			"$lookup": bson.M{
				"from":         "users",            // Join with the "users" collection
				"localField":   "comments.user_id", // Match user_id in the comments collection
				"foreignField": "_id",              // Match with the _id in the users collection
				"as":           "comment_users",    // Store the matched users in a field named "comment_users"
			},
		},
		// Step 6: Add fields for like count, comment count, user name, and tags
		{
			"$addFields": bson.M{
				"like_count": bson.M{
					"$size": "$likes", // Count the number of likes
				},
				"comment_count": bson.M{
					"$size": "$comments", // Count the number of comments
				},
				"user_name": bson.M{
					"$arrayElemAt": []interface{}{"$user.name", 0}, // Get the first matched user's name for the resolution
				},
				"tags": bson.M{
					"$ifNull": []interface{}{"$tags", []interface{}{}}, // Ensure there is a tags field even if empty
				},
				"comments": bson.M{
					"$map": bson.M{
						"input": "$comments",
						"as":    "comment",
						"in": bson.M{
							"$mergeObjects": []interface{}{
								"$$comment", // Retain the original comment fields
								bson.M{
									"user_name": bson.M{
										"$arrayElemAt": []interface{}{"$comment_users.name", 0}, // Get the user's name for each comment
									},
								},
							},
						},
					},
				},
			},
		},
		// Step 7: Optionally, you can project the fields you want to return (resolution data, likes, comments, user name, tags)
		{
			"$project": bson.M{
				"resolution":    1, // Include the resolution field (or other fields as needed)
				"like_count":    1, // Include like count
				"comment_count": 1, // Include comment count
				"comments":      1, // Include comments (now with user names)
				"user_name":     1, // Include user name for the resolution
				"tags":          1, // Include tags array
				"created_at":    1, // Include created_at field
				"updated_at":    1, // Include updated_at field
			},
		},
		// Optional: Sort by like count in descending order (optional)
		{
			"$sort": bson.M{
				"like_count": -1, // Sort by like count in descending order
			},
		},
	}

	// Execute the aggregation query
	cursor, err := resolutionsCollection.Aggregate(context.Background(), aggPipeline)
	if err != nil {
		log.Printf("Error during aggregation: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve resolution"})
		return
	}
	defer cursor.Close(context.Background())

	// Parse the aggregation result into a list of resolutions
	var results []bson.M
	if err := cursor.All(context.Background(), &results); err != nil {
		log.Printf("Error parsing aggregation result: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse result"})
		return
	}

	// If no resolution is found
	if len(results) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Resolution not found"})
		return
	}

	// Return the results
	c.JSON(http.StatusOK, gin.H{
		"resolution": results[0], // Only one result since we filtered by _id
	})
}
