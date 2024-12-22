package controllers

import (
	"context"
	"log"
	"net/http"
	"nyr/db" // Import the db package to interact with MongoDB

	// Import the models package for the resolution model

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// GetResolutionByID handles fetching a resolution by its ID with the like count, comment count, and all comments.
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

	// Aggregate pipeline to get the resolution with likes count, comment count, and all comments
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
		// Step 4: Add fields for like count and comment count
		{
			"$addFields": bson.M{
				"like_count": bson.M{
					"$size": "$likes", // Count the number of likes
				},
				"comment_count": bson.M{
					"$size": "$comments", // Count the number of comments
				},
				"comments": bson.M{
					"$ifNull": []interface{}{"$comments", []interface{}{}}, // Ensure there is a comments field even if empty
				},
			},
		},
		// Step 5: Optionally, you can project the fields you want to return (resolution data, likes, comments)
		{
			"$project": bson.M{
				"resolution":    1, // Include the resolution field (or other fields as needed)
				"like_count":    1, // Include like count
				"comment_count": 1, // Include comment count
				"comments":      1, // Include comments
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
