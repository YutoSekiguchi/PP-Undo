package service

import (
	"time"
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

// 全てのノートからimageとstrokedata以外取得
func (s NotesService) GetAllNotesWithoutLongData(db *gorm.DB) ([]NotesWithoutLongData, error) {
	var n []NotesWithoutLongData
	if err := db.Raw("SELECT id, nfid, uid, title, avg_pressure,avg_pressure_list, all_avg_pressure_list, is_show_stroke_list, all_stroke_count, stroke_count, undo_count, redo_count, log_redo_count, ppundo_count FROM `notes`").Scan(&n).Error; err != nil {
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

type NoteNameAndIDData struct {
	ID                 int       `gorm:"primary_key;not null;autoIncrement:true"`
	NFID               int       `gorm:"not null;column:nfid"`
	UID                int       `gorm:"not null;column:uid"`
	Title              string    `gorm:"not null;column:title"`
	Width              float64   `gorm:"not null;column:width"`
	Height             float64   `gorm:"not null;column:height"`
	NoteImage          string    `gorm:"not null;column:note_image"`
	BackgroundImage    string    `gorm:"column:background_image"`
	CreatedAt          time.Time `sql:"DEFALUT:current_timestamp;column:created_at"`
}


// nfidとuidからノートを全て取得
func (s NotesService) GetNotesByNFIDAndUID(db *gorm.DB, c echo.Context) ([]NoteNameAndIDData, error) {
	var n []NoteNameAndIDData
	nfid := c.Param("nfid")
	uid := c.Param("uid")

	if err := db.Raw("SELECT id, nfid, uid, title, width, height, note_image, background_image, created_at FROM `notes` WHERE nfid = ? AND uid = ?", nfid, uid).Scan(&n).Error; err != nil {
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
// タイトルの変更
func (s NotesService) UpdateNoteTitleByID(db *gorm.DB, c echo.Context) (*Notes, error) {
	var n *Notes
	c.Bind(&n)
	
	if err := db.Model(&Notes{}).Where("id = ?", n.ID).Update("title", n.Title).Error; err != nil {
		return nil, err
	}
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