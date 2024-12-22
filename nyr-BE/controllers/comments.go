package controllers

import (
	"context"
	"log"
	"net/http"
	"nyr/db"
	"nyr/models"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// CreateComment handles the creation of a new comment.
func CreateComment(c *gin.Context) {
	var newComment models.Comments

	// Bind the incoming JSON to the Comments struct
	if err := c.ShouldBindJSON(&newComment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// Check that the resolution ID and user ID are provided
	if newComment.RID.IsZero() || newComment.UserID.IsZero() {
		c.JSON(http.StatusBadRequest, gin.H{"error": "UserID and ResolutionID are required"})
		return
	}
	newComment.Comment = strings.TrimSpace(newComment.Comment)
	if newComment.Comment == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Comment cannot be empty"})
		return
	}
	// Set created and updated times
	newComment.CreatedAt = time.Now()
	newComment.UpdatedAt = time.Now()

	// Get the comments collection from the database
	collection := db.GetCollection("comments")

	// Insert the new comment into the database
	result, err := collection.InsertOne(context.Background(), newComment)
	if err != nil {
		log.Printf("Error inserting comment: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create comment"})
		return
	}

	// Return the success message along with the ID of the newly created comment
	c.JSON(http.StatusCreated, gin.H{
		"message":    "Comment created successfully",
		"comment_id": result.InsertedID,
	})
}
