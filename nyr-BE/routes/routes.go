package routes

import (
	"nyr/controllers"

	"github.com/gin-gonic/gin"
)

func InitRoutes(router *gin.Engine) {
	// health check
	router.GET("/health", controllers.HealthCheck)

	// auth routes
	router.GET("/auth/google", controllers.GoogleLogin)
	router.GET("/auth/google/callback", controllers.GoogleCallback)
}
