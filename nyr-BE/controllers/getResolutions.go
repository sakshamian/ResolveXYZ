package controllers

import (
	"context"
	"log"
	"net/http"
	"nyr/db"
	"strconv"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

// GetResolutions handles the retrieval of paginated resolutions with like count and comment count.
func GetResolutions(c *gin.Context) {
	// Get the page and limit query parameters
	page, err := strconv.Atoi(c.DefaultQuery("page", "1"))
	if err != nil {
		page = 1 // default to page 1 if no page parameter is provided or invalid
	}
	limit, err := strconv.Atoi(c.DefaultQuery("limit", "6"))
	if err != nil {
		limit = 6 // default to 10 items per page
	}

	// Calculate skip for pagination
	skip := (page - 1) * limit

	// Get the resolutions collection
	resolutionsCollection := db.GetCollection("resolutions")

	// Aggregate pipeline to get resolutions with like count and comment count
	aggPipeline := []bson.M{
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
		// Step 3: Add fields for like count and comment count
		{
			"$addFields": bson.M{
				"like_count": bson.M{
					"$size": "$likes", // Count the number of likes
				},
				"comment_count": bson.M{
					"$size": "$comments", // Count the number of comments
				},
			},
		},
		// Step 4: Optionally, you can project the fields to only return certain fields (optional)
		{
			"$project": bson.M{
				"resolution":    1, // Return the resolution field (or any other fields from the resolution)
				"like_count":    1, // Return the like count
				"comment_count": 1, // Return the comment count
				"created_at":    1, // Include created_at field (or any other fields you need)
				"updated_at":    1, // Include updated_at field
			},
		},
		// Optional: Sort by like count in descending order (optional)
		{
			"$sort": bson.M{
				"like_count": -1, // Sort by like count in descending order
			},
		},
		// Step 5: Skip and Limit for pagination
		{
			"$skip": skip,
		},
		{
			"$limit": limit,
		},
	}

	// Execute the aggregation query
	cursor, err := resolutionsCollection.Aggregate(context.Background(), aggPipeline)
	if err != nil {
		log.Printf("Error during aggregation: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve resolutions"})
		return
	}
	defer cursor.Close(context.Background())

	// Parse the aggregation result
	var results []bson.M
	if err := cursor.All(context.Background(), &results); err != nil {
		log.Printf("Error parsing aggregation result: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse result"})
		return
	}

	// Get the total count of resolutions to determine if there are more to load
	totalCount, err := resolutionsCollection.CountDocuments(context.Background(), bson.M{})
	if err != nil {
		log.Printf("Error counting documents: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count resolutions"})
		return
	}

	// Convert page * limit to int64 for comparison
	hasMore := int64(page*limit) < totalCount

	// Return the results along with pagination info
	c.JSON(http.StatusOK, gin.H{
		"resolutions": results,
		"has_more":    hasMore,
		"page":        page,
		"limit":       limit,
	})
}
