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
		noteFolder.GET("/tree/:id", ctrl.HandleGetNoteFoldersTree)
		noteFolder.PUT("/:id", ctrl.HandleUpdateNoteFolderByID)
		noteFolder.DELETE("/:id", ctrl.HandleDeleteNoteFolderByID)
	}

	// Notes
	note := e.Group("/notes")
	{
		note.GET("", ctrl.HandleGetAllNotes)
		note.POST("", ctrl.HandlePostNote)
		note.PUT("/:id", ctrl.HandleUpdateNoteByID)
		note.GET("/:id", ctrl.HandleGetNoteByID)
		note.GET("/in/:nfid", ctrl.HandleGetNotesByNFID)
	}

	// Strokes
	strokes := e.Group("/strokes")
	{
		strokes.GET("/:id", ctrl.HandleGetStrokeByID)
		strokes.GET("/in/note/:nid", ctrl.HandleGetStrokesByNID)
		strokes.POST("", ctrl.HandlePostStrokes)
		strokes.PUT("/save/:nid", ctrl.HandleUpdateNotSaveStrokes)
		strokes.DELETE("/notsave/:nid", ctrl.HandleDeleteNotSaveStrokes)
	}

	// logs
	logs := e.Group("/logs")
	{
		logs.GET("/:id", ctrl.HandleGetLogByID)
		logs.GET("/in/:nid", ctrl.HandleGetLogsByNID)
		logs.POST("", ctrl.HandlePostLog)
	}

	// client_logs
	clientLogs := e.Group("/clientlogs")
	{
		clientLogs.GET("/in/:nid", ctrl.HandleGetClientLogsByNID)
		clientLogs.POST("", ctrl.HandlePostClientLog)
	}

	// UndoCounts
	undoCounts := e.Group("/undocounts")
	{
		undoCounts.GET("/note/:nid", ctrl.HandleGetUndoCountsByNID)
		undoCounts.GET("/user/:uid", ctrl.HandleGetUndoCountsByUID)
		undoCounts.POST("", ctrl.HandlePostUndoCounts)
	}

	// RedoCounts
	redoCounts := e.Group("/redocounts")
	{
		redoCounts.GET("/note/:nid", ctrl.HandleGetRedoCountsByNID)
		redoCounts.GET("/user/:uid", ctrl.HandleGetRedoCountsByUID)
		redoCounts.POST("", ctrl.HandlePostRedoCounts)
	}

	// PPUndoCounts
	ppUndoCounts := e.Group("/ppundocounts")
	{
		ppUndoCounts.GET("/note/:nid", ctrl.HandleGetPPUndoCountsByNID)
		ppUndoCounts.POST("", ctrl.HandlePostPPUndoCount)
	}

	// LogRedoCounts
	logRedoCounts := e.Group("/logredocounts")
	{
		logRedoCounts.GET("/note/:nid", ctrl.HandleGetLogRedoCountsByNID)
		logRedoCounts.POST("", ctrl.HandlePostLogRedoCount)
	}

	// Routing
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, Echo!!")
	})
	
	// Start server
	e.Logger.Fatal(e.Start(":8080"))
}