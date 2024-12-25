package middleware

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

var jwtKey = []byte(os.Getenv("JWT_SECRET_KEY"))

// Claims to use in future
type Claims struct {
	UserId string `json:"user_id"`
	jwt.StandardClaims
}

// AuthMiddleware is the middleware to protect routes with JWT authentication
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get the token from the Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is missing"})
			c.Abort()
			return
		}

		// Token format is "Bearer <token>"
		tokenString := strings.Split(authHeader, " ")
		if len(tokenString) != 2 || tokenString[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization format is incorrect"})
			c.Abort()
			return
		}

		// Parse the JWT token
		token, err := jwt.ParseWithClaims(tokenString[1], &Claims{}, func(token *jwt.Token) (interface{}, error) {
			// Check token signing method
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return jwtKey, nil
		})

		// Handle any parsing error or invalid token
		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		// Extract claims (you can use these in your handlers)
		if claims, ok := token.Claims.(*Claims); ok && token.Valid {
			c.Set("user_id", claims.UserId)
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			c.Abort()
			return
		}

		// Proceed to the next handler
		c.Next()
	}
}

func PostsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get the token from the Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.Set("user_id", "")
			c.Next()
			return
		}

		// Token format is "Bearer <token>"
		tokenString := strings.Split(authHeader, " ")
		if len(tokenString) != 2 || tokenString[0] != "Bearer" {
			c.Set("user_id", "") // Invalid format, continue without user
			c.Next()
			return
		}

		// Parse the JWT token
		token, err := jwt.ParseWithClaims(tokenString[1], &Claims{}, func(token *jwt.Token) (interface{}, error) {
			// Check token signing method
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return jwtKey, nil
		})

		// If there is an error or the token is invalid, set user_id as nil and continue
		if err != nil || !token.Valid {
			c.Set("user_id", "") // Token is invalid, continue without user
			c.Next()
			return
		}

		// If the token is valid, extract the claims and set user_id in the context
		if claims, ok := token.Claims.(*Claims); ok && token.Valid {
			c.Set("user_id", claims.UserId) // Set user_id from claims
		} else {
			c.Set("user_id", "") // If claims are invalid, set user_id as nil
		}

		// Proceed to the next handler
		c.Next()
	}
}
