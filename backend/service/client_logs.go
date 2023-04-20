package service

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type ClientLogsService struct{}

// GET
// nidからノートごとのclient用のログを取得
func (s ClientLogsService) GetClientLogsByNID(db *gorm.DB, c echo.Context) ([]ClientLogs, error) {
	var cl []ClientLogs
	nid := c.Param("nid")

	if err := db.Raw("SELECT * FROM `client_logs` WHERE nid = ?", nid).Scan(&cl).Error; err != nil {
		return nil, err
	}
	return cl, nil
}

// POST
func (s ClientLogsService) PostClientLog(db *gorm.DB, c echo.Context) (ClientLogs, error) {
	var cl ClientLogs
	c.Bind(&cl)

	if err := db.Create(&cl).Error; err != nil {
		return cl, err
	}
	return cl, nil
}