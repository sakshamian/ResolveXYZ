package routes

import (
	"nyr/controllers"
	"nyr/middleware"

	"github.com/gin-gonic/gin"
)

func InitRoutes(router *gin.Engine) {
	// health check
	router.GET("/health", controllers.HealthCheck)

	// cors middleware
	router.Use(middleware.CorsMiddleware())

	// auth routes
	router.GET("/auth/google", controllers.GoogleLogin)
	router.POST("/auth/google/callback", controllers.GoogleLoginLatest)

	// token verification
	router.GET("/verify-token", controllers.VerifyTokenHandler)

	// resolution routes
	resolutionRoutes := router.Group("resolution")
	{
		resolutionRoutes.POST("", controllers.CreateResolution)
		resolutionRoutes.POST("/likes", controllers.ToggleLikeResolution)
		resolutionRoutes.POST("/comments", controllers.CreateComment)
		resolutionRoutes.GET("", controllers.GetResolutions)
		resolutionRoutes.GET("/:id", controllers.GetResolutionByID)
	}
}
