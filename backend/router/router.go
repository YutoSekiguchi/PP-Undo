package router

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"gorm.io/gorm"

	"github.com/YutoSekiguchi/ppundo/controller"
)

func InitRouter(db *gorm.DB) {
	e := echo.New()

	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: "method=${method}, uri={uri}, status=${status}\n",
	}))
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*", "https://vps7.nkmr.io", "https://ppundo.nkmr.io"},
		AllowHeaders: []string{echo.HeaderAuthorization, echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
	}))
	ctrl := controller.NewController(db)

	// ExamUser
	examUser := e.Group("/examusers")
	{
		examUser.GET("", ctrl.HandleGetExamUserList)
		examUser.GET("/me", ctrl.HandleGetExamUserByNameAndPwd)
		examUser.GET("/:id", ctrl.HandleGetExamUserByID)
		examUser.POST("", ctrl.HandlePostExamUser)
	}


	// NoteFolders
	noteFolder := e.Group("/notefolders")
	{
		noteFolder.GET("", ctrl.HandleGetAllNoteFolders)
		noteFolder.POST("", ctrl.HandlePostNoteFolder)
		noteFolder.GET("/:id", ctrl.HandleGetNoteFolderByID)
		noteFolder.GET("/user/:uid", ctrl.HandleGetNoteFoldersByUID)
		noteFolder.GET("/hierarchy/:uid/:pnfid", ctrl.HandleGetNoteFoldersByUIDAndParentNFID)
		noteFolder.PUT("/:id", ctrl.HandleUpdateNoteFolderByID)
		noteFolder.DELETE("/:id", ctrl.HandleDeleteNoteFolderByID)
	}
	
	// Routing
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, Echo!!")
	})
	
	// Start server
	e.Logger.Fatal(e.Start(":8080"))
}