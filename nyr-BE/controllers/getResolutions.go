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

// GetResolutions handles the retrieval of paginated resolutions with like count, comment count, user name, and tags.
func GetResolutions(c *gin.Context) {
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

	// Aggregate pipeline to get resolutions with like count, comment count, user name, user_id, and tags
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
		// Step 3: Look up the "users" collection to get the user's name and user_id for each resolution
		{
			"$lookup": bson.M{
				"from":         "users",   // Join with the "users" collection
				"localField":   "user_id", // Match the user_id in the resolutions collection
				"foreignField": "_id",     // Match with the _id in the users collection
				"as":           "user",    // Store the matched user in a field named "user"
			},
		},
		// Step 4: Add fields for like count, comment count, user name, user_id, and tags
		{
			"$addFields": bson.M{
				"like_count": bson.M{
					"$size": "$likes", // Count the number of likes
				},
				"comment_count": bson.M{
					"$size": "$comments", // Count the number of comments
				},
				"user_name": bson.M{
					"$arrayElemAt": []interface{}{"$user.name", 0}, // Get the first matched user name
				},
				"user_id": bson.M{
					"$arrayElemAt": []interface{}{"$user._id", 0}, // Get the first matched user ID
				},
				"tags": bson.M{
					"$ifNull": []interface{}{"$tags", []interface{}{}},
				}, // Include the tags array from the resolutions collection
			},
		},
		// Step 5: Project the required fields including resolution, like count, comment count, user name, tags, user_id, and timestamps
		{
			"$project": bson.M{
				"resolution":    1, // Include the resolution field (or other fields as needed)
				"like_count":    1, // Include like count
				"comment_count": 1, // Include comment count
				"user_name":     1, // Include user name
				"user_id":       1, // Include user ID
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
		// Step 6: Skip and Limit for pagination
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
