package service

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type RedoCountsService struct{}

// GET
// nidからノートごとのRedo回数を取得
func (s RedoCountsService) GetRedoCountsByNID(db *gorm.DB, c echo.Context) ([]RedoCounts, error) {
	var rc []RedoCounts
	nid := c.Param("nid")

	if err := db.Raw("SELECT * FROM `redo_counts` WHERE nid = ?", nid).Scan(&rc).Error; err != nil {
		return nil, err
	}
	return rc, nil
}

// uidからノートごとのRedo回数を取得
func (s RedoCountsService) GetRedoCountsByUID(db *gorm.DB, c echo.Context) ([]RedoCounts, error) {
	var rc []RedoCounts
	uid := c.Param("uid")

	if err := db.Raw("SELECT * FROM `redo_counts` WHERE uid = ?", uid).Scan(&rc).Error; err != nil {
		return nil, err
	}
	return rc, nil
}

// POST
// redo回数の追加
func (s RedoCountsService) PostRedoCounts(db *gorm.DB, c echo.Context) (RedoCounts, error) {
	var rc RedoCounts
	c.Bind(&rc)

	if err := db.Create(&rc).Error; err != nil {
		return rc, err 
	}
	return rc, nil
}