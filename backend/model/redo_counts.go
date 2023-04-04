package model

import "time"

type RedoCounts struct {
	ID                   int       `gorm:"primary_key;not null;autoIncrement:true"`
	UID                  int       `gorm:"not null;column:uid"`
	NID                  int       `gorm:"not null;column:nid"`
	BeforeRedoNoteImage  string    `gorm:"not null;column:before_redo_note_image"`
	BeforeRedoStrokeData string    `gorm:"not null;column:before_redo_stroke_data"`
	AfterRedoNoteImage   string    `gorm:"not null;column:after_redo_note_image"`
	AfterRedoStrokeData  string    `gorm:"not null;column:after_redo_stroke_data"`
	LeftStrokeCount      int       `gorm:"not null;column:left_stroke_count"`
	CreatedAt            time.Time `sql:"DEFALUT:current_timestamp;column:created_at"`
}