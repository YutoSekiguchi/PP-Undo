package service

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type UndoCountsService struct{}

// GET
// nidからノートごとのUndo回数を取得
func (s UndoCountsService) GetUndoCountsByNID(db *gorm.DB, c echo.Context) ([]UndoCounts, error) {
	var uc []UndoCounts
	nid := c.Param("nid")

	if err := db.Raw("SELECT * FROM `undo_counts` WHERE nid = ?", nid).Scan(&uc).Error; err != nil {
		return nil, err
	}
	return uc, nil
}

// uidからノートごとのUndo回数を取得
func (s UndoCountsService) GetUndoCountsByUID(db *gorm.DB, c echo.Context) ([]UndoCounts, error) {
	var uc []UndoCounts
	uid := c.Param("uid")

	if err := db.Raw("SELECT * FROM `undo_counts` WHERE uid = ?", uid).Scan(&uc).Error; err != nil {
		return nil, err
	}
	return uc, nil
}

// POST
// undo回数の追加
func (s UndoCountsService) PostUndoCounts(db *gorm.DB, c echo.Context) (UndoCounts, error) {
	var uc UndoCounts
	c.Bind(&uc)

	if err := db.Create(&uc).Error; err != nil {
		return uc, err 
	}
	return uc, nil
}