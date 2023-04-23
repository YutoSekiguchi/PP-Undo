package service

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type PPUndoCountsService struct{}

// GET
// nidからノートごとのPPUndo回数を取得
func (s PPUndoCountsService) GetPPUndoCountsByNID(db *gorm.DB, c echo.Context) ([]PPUndoCounts, error) {
	var puc []PPUndoCounts
	nid := c.Param("nid")

	if err := db.Raw("SELECT * FROM `pp_undo_counts` WHERE nid = ?", nid).Scan(&puc).Error; err != nil {
		return nil, err
	}
	return puc, nil
}

// POST
// ppundo回数の追加
func (s PPUndoCountsService) PostPPUndoCount(db *gorm.DB, c echo.Context) (PPUndoCounts, error) {
	var puc PPUndoCounts
	c.Bind(&puc)

	if err := db.Create(&puc).Error; err != nil {
		return puc, err
	}
	return puc, nil
}