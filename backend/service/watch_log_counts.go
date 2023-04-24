package service

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type WatchLogCountsService struct{}

// GET
// nidからログを見た回数の取得
func (s WatchLogCountsService) GetWatchLogsCountsByNID(db *gorm.DB, c echo.Context) ([]WatchLogsCounts, error) {
	var wlc []WatchLogsCounts
	nid := c.Param("nid")

	if err := db.Raw("SELECT * FROM `watch_logs_counts` WHERE nid = ?", nid).Scan(&wlc).Error; err != nil {
		return nil, err
	}
	return wlc, nil
}

// POST
func (s WatchLogCountsService) PostWatchLogsCount(db *gorm.DB, c echo.Context) (WatchLogsCounts, error) {
	var wlc WatchLogsCounts
	c.Bind(&wlc)

	if err := db.Create(&wlc).Error; err != nil {
		return wlc, err
	}
	return wlc, nil
}