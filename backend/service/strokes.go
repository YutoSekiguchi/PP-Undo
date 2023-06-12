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

// PUT 保存済にする
func (s StrokesService) UpdateNotSaveStrokes(db *gorm.DB, c echo.Context) ([]Strokes, error) {
	var st []Strokes
	nid := c.Param("nid")
	
	if err := db.Table("strokes").Where("nid = ?", nid).Updates(map[string]interface{}{"save": 1}).Scan(&st).Error; err != nil {
		return nil, err
	}

	return st, nil
}

// PUT Group番号を付与
func (s StrokesService) UpdateStrokesGroup(db *gorm.DB, c echo.Context) ([]Strokes, error) {
	var st []Strokes
	id1 := c.Param("id1")
	id2 := c.Param("id2")
	gnum := c.Param("gnum")
	if err := db.Table("strokes").Where("id >= ?", id1).Where("id <= ?", id2).Updates(map[string]interface{}{"group_num": gnum}).Scan(&st).Error; err != nil {
		return nil, err
	}

	return st, nil
}

// DELETE
// 保存してないストロークの削除
func (s StrokesService) DeleteNotSaveStrokes(db *gorm.DB, c echo.Context) ([]Strokes, error) {
	var st []Strokes
	nid := c.Param("nid")

	if err := db.Where("nid = ?", nid).Where("save = 0").Delete(&st).Error; err != nil {
		return st, err
	}
	return st, nil
}