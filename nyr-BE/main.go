package main

import (
	"fmt"
	"log"
	"nyr/config"
	"nyr/db"
	"nyr/routes"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// load env
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file", err)
	}

	config.InitializeOAuthConfig()

	db.Connect()

	router := gin.Default()
	routes.InitRoutes(router)

	//getting PORT from env file
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
