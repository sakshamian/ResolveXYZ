package controllers

import (
	"context"
	"net/http"
	"nyr/db"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func UpdateUser(c *gin.Context) {
	userID := c.GetString("user_id")
	var requestBody struct {
		Name string `json:"name" binding:"required"`
	}

	// Bind JSON request to struct
	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userObjectID, _ := primitive.ObjectIDFromHex(userID)
	filter := bson.M{"_id": userObjectID}
	update := bson.M{"$set": bson.M{"name": requestBody.Name}}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	userCollection := db.GetCollection("users")
	result, err := userCollection.UpdateOne(ctx, filter, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User name updated successfully"})
}
