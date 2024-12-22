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
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CreateResolution(c *gin.Context) {
	var newResolution models.Resolution
	if err := c.ShouldBindJSON(&newResolution); err != nil {
		log.Printf("Error binding JSON: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	newResolution.Resolution = strings.TrimSpace(newResolution.Resolution)

	if newResolution.Resolution == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Resolution cannot be empty"})
		return
	}
	newResolution.RID = primitive.NewObjectID()
	newResolution.CreatedAt = time.Now()
	newResolution.UpdatedAt = time.Now()
	collection := db.GetCollection("resolutions")
	result, err := collection.InsertOne(context.Background(), newResolution)
	if err != nil {
		log.Printf("Error inserting into MongoDB: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create resolution"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{
		"message": "Resolution created successfully",
		"r_id":    result.InsertedID,
	})
}
