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

// nfidとuidからノートを全て取得
func (s NotesService) GetNotesByNFIDAndUID(db *gorm.DB, c echo.Context) ([]Notes, error) {
	var n []Notes
	nfid := c.Param("nfid")
	uid := c.Param("uid")

	if err := db.Raw("SELECT * FROM `notes` WHERE nfid = ? AND uid = ?", nfid, uid).Scan(&n).Error; err != nil {
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

// DELETE
// ノートの削除
func (s NotesService) DeleteNoteByID(db * gorm.DB, c echo.Context) ([]Notes, error) {
	var notes []Notes
	var clientlogs []ClientLogs
	var lrc []LogRedoCounts
	var logs []Logs
	var puc []PPUndoCounts
	var rc []RedoCounts
	var strokes []Strokes
	var uc []UndoCounts
	var error error
	error = nil
	id := c.Param("id")

	go func() {
		if err := db.Where("id = ?", id).Delete(&notes).Error; err != nil {
			error = err
		}
	}()

	go func() {
		if err := db.Where("nid = ?", id).Delete(&clientlogs).Error; err != nil {
			error = err
		}
	}()

	go func() {
		if err := db.Where("nid = ?", id).Delete(&lrc).Error; err != nil {
			error = err
		}
	}()

	go func() {
		if err := db.Where("nid = ?", id).Delete(&logs).Error; err != nil {
			error = err
		}
	}()

	go func() {
		if err := db.Where("nid = ?", id).Delete(&puc).Error; err != nil {
			error = err
		}
	}()

	go func() {
		if err := db.Where("nid = ?", id).Delete(&rc).Error; err != nil {
			error = err
		}
	}()

	go func() {
		if err := db.Where("nid = ?", id).Delete(&strokes).Error; err != nil {
			error = err
		}
	}()

	go func() {
		if err := db.Where("nid = ?", id).Delete(&uc).Error; err != nil {
			error = err
		}
	}()

	if (error != nil) {
		return nil, error
	}
	return notes, nil
}