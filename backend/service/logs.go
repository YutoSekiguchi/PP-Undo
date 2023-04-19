package service

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type LogsService struct{}

// GET
// idからLogの取得
func (s LogsService) GetLogByID(db *gorm.DB, c echo.Context) (*Logs, error) {
	l := new(Logs)
	id := c.Param("id")

	if err := db.Raw("SELECT * FROM `logs` WHERE id = ?", id).Scan(&l).Error; err != nil {
		return nil, err
	}
	return l, nil
}

// nidからlogを取得
func (s LogsService) GetLogsByNID(db *gorm.DB, c echo.Context) ([]Logs, error) {
	var l []Logs
	nid := c.Param("nid")

	if err := db.Raw("SELECT * FROM `logs` WHERE nid = ?", nid).Scan(&l).Error; err != nil {
		return nil, err
	}
	return l, nil
}

// POST
// ログの追加
func (s LogsService) PostLog(db *gorm.DB, c echo.Context) (Logs, error) {
	var l Logs
	c.Bind(&l)

	if err := db.Create(&l).Error; err != nil {
		return l, err
	}
	return l, nil
}