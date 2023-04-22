package service

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type LogRedoCountsService struct{}

// GET
// nidからlog_redo時の情報を取得
func (s LogRedoCountsService) GetLogRedoCountsByNID(db *gorm.DB, c echo.Context) ([]LogRedoCounts, error) {
	var lrc []LogRedoCounts
	nid := c.Param("nid")

	if err := db.Raw("SELECT * FROM `log_redo_counts` WHERE nid = ?", nid).Scan(&lrc).Error; err != nil {
		return nil, err
	}
	return lrc, nil
}

// POST
// log_redo時の情報を追加
func (s LogRedoCountsService) PostLogRedoCount(db *gorm.DB, c echo.Context) (LogRedoCounts, error) {
	var lrc LogRedoCounts
	c.Bind(&lrc)

	if err := db.Create(&lrc).Error; err != nil {
		return lrc, err
	}
	return lrc, nil
}