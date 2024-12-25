package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"nyr/config"
	"nyr/db"
	"nyr/models"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var (
	jwtSecretKey = []byte(os.Getenv("JWT_SECRET_KEY"))
)

func GoogleLogin(c *gin.Context) {
	url := config.GoogleOAuthConfig.AuthCodeURL("state")
	c.Redirect(http.StatusTemporaryRedirect, url)
}

func GoogleCallback(c *gin.Context) {
	code := c.Query("code")
	if code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Code not provided"})
		return
	}

	token, err := config.GoogleOAuthConfig.Exchange(context.Background(), code)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to exchange token"})
		return
	}

	client := config.GoogleOAuthConfig.Client(context.Background(), token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user info"})
		return
	}
	defer resp.Body.Close()

	var userInfo map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&userInfo); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse user info"})
		return
	}

	email := userInfo["email"].(string)
	username := userInfo["name"].(string)
	image := userInfo["picture"].(string)

	collection := db.GetCollection("users")
	var existingUser models.User
	err = collection.FindOne(context.Background(), bson.M{"email": email}).Decode(&existingUser)
	if err != nil {
		// Create a new user if not found
		newUser := models.User{
			ID:        primitive.NewObjectID(),
			Name:      username,
			Email:     email,
			Image:     image,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}
		_, err := collection.InsertOne(context.Background(), newUser)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
			return
		}
		existingUser = newUser
	}

	// Generate JWT token
	tokenString, err := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": existingUser.ID.Hex(),
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	}).SignedString(jwtSecretKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": tokenString, "user": existingUser})
}

func GoogleLoginLatest(c *gin.Context) {
	var requestBody struct {
		Token string `json:"token"`
	}

	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Validate the token with Google's API
	tokenInfoURL := fmt.Sprintf("https://oauth2.googleapis.com/tokeninfo?id_token=%s", requestBody.Token)

	resp, err := http.Get(tokenInfoURL)
	if err != nil || resp.StatusCode != http.StatusOK {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Google token"})
		return
	}
	defer resp.Body.Close()

	var userInfo map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&userInfo); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode user info"})
		return
	}

	// Process user info (e.g., save to database)
	email := userInfo["email"].(string)
	username := userInfo["name"].(string)
	image := userInfo["picture"].(string)

	collection := db.GetCollection("users")
	var firstlogin bool
	var existingUser models.User
	err = collection.FindOne(context.Background(), bson.M{"email": email}).Decode(&existingUser)
	firstlogin = false
	if err != nil {
		// Create a new user if not found
		newUser := models.User{
			ID:        primitive.NewObjectID(),
			Name:      username,
			Email:     email,
			Image:     image,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}
		_, err := collection.InsertOne(context.Background(), newUser)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
			return
		}
		firstlogin = true
		existingUser = newUser
	}

	// Generate JWT token
	tokenString, err := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": existingUser.ID.Hex(),
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	}).SignedString(jwtSecretKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Login successful", "token": tokenString, "user": existingUser, "firstlogin": firstlogin})
}
