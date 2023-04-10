package service

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type StrokesService struct{}

// GET
// idからストロークを取得
func (s StrokesService) GetStrokeByID(db *gorm.DB, c echo.Context) (*Strokes, error) {
	stroke := new(Strokes)
	id := c.Param("id")

	if err := db.Raw("SELECT * FROM `strokes` WHERE id = ? LIMIT 1", id).Scan(&stroke).Error; err != nil {
		return nil, err
	}
	return stroke, nil
}

// ノート内の全てのストロークを取得
func (s StrokesService) GetStrokesByNID(db *gorm.DB, c echo.Context) ([]Strokes, error) {
	var stroke []Strokes
	nid := c.Param("nid")

	if err := db.Raw("SELECT * FROM `strokes` WHERE nid = ?", nid).Scan(&stroke).Error; err != nil {
		return nil, err
	}
	return stroke, nil
}

// POST
// ノートの追加
func (s StrokesService) PostStrokes(db *gorm.DB, c echo.Context) (Strokes, error) {
	var strokes Strokes
	c.Bind(&strokes)

	if err := db.Create(&strokes).Error; err != nil {
		return strokes, err
	}
	return strokes, nil
}