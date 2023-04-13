package service

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type NotesService struct{}

// GET
// 全てのノートを取得
func (s NotesService) GetAllNotes(db *gorm.DB) ([]Notes, error) {
	var n []Notes
	if err := db.Find(&n).Error; err != nil {
		return nil, err
	}
	return n, nil
}

// idからノートの取得
func (s NotesService) GetNoteByID(db *gorm.DB, c echo.Context) (*Notes, error) {
	n := new(Notes)
	id := c.Param("id")

	if err := db.Raw("SELECT * FROM `notes` WHERE id = ?", id).Scan(&n).Error; err != nil {
		return nil, err
	}
	return n, nil
}

// nfidからノートを全て取得
func (s NotesService) GetNotesByNFID(db *gorm.DB, c echo.Context) ([]Notes, error) {
	var n []Notes
	nfid := c.Param("nfid")

	if err := db.Raw("SELECT * FROM `notes` WHERE nfid = ?", nfid).Scan(&n).Error; err != nil {
		return nil, err
	}
	return n, nil
}

// POST
// ノートの作成
func (s NotesService) PostNote(db *gorm.DB, c echo.Context) (Notes, error) {
	var notes Notes
	c.Bind(&notes)

	if err := db.Create(&notes).Error; err != nil {
		return notes, err
	}
	return notes, nil
}

// PUT
// ノートの編集
func (s NotesService) UpdateNoteByID(db *gorm.DB, c echo.Context) (*Notes, error) {
	n := new(Notes)
	id := c.Param("id")
	if err := db.Where("id = ?", id).First(&n).Error; err != nil {
		return nil, err
	}
	if err := c.Bind(&n); err != nil {
		return n, err
	}
	db.Save(&n)

	return n, nil
}