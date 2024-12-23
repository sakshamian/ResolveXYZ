package controllers

import (
	"context"
	"log"
	"net/http"
	"nyr/db"
	"nyr/models"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func ToggleLikeResolution(c *gin.Context) {
	var request struct {
		RID primitive.ObjectID `json:"r_id" binding:"required"`
	}

	userId := c.GetString("user_id")
	userObjectID, _ := primitive.ObjectIDFromHex(userId)

	// Bind the incoming JSON to the request struct
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get the "likes" collection from the database
	collection := db.GetCollection("likes")

	filter := bson.D{
		bson.E{Key: "user_id", Value: userObjectID},
		bson.E{Key: "r_id", Value: request.RID},
	}

	// Check if a like already exists for the user and resolution
	var existingLike models.Likes
	err := collection.FindOne(context.Background(), filter).Decode(&existingLike)

	if err == nil {
		// If the like exists, remove it (unlike)
		_, err := collection.DeleteOne(context.Background(), filter)
		if err != nil {
			log.Printf("Error deleting like from MongoDB: %v\n", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to unlike resolution"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Resolution unliked successfully"})
		return
	}

	// If no like exists, insert a new like (like the post)
	newLike := models.Likes{
		ID:        primitive.NewObjectID(),
		UserID:    userObjectID,
		RID:       request.RID,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	_, err = collection.InsertOne(context.Background(), newLike)
	if err != nil {
		log.Printf("Error inserting like into MongoDB: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to like resolution"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Resolution liked successfully"})
}
