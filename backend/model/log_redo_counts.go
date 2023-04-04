package model

import "time"

type LogRedoCounts struct {
	ID                       int       `gorm:"primary_key;not null;autoIncrement:true"`
	UID                      int       `gorm:"not null;column:uid"`
	NID                      int       `gorm:"not null;column:nid"`
	BeforeLogRedoNoteImage   string    `gorm:"not null;column:before_log_redo_note_image"`
	BeforeLogRedoStrokeData  string    `gorm:"not null;column:before_log_redo_stroke_data"`
	AfterLogRedoNoteImage    string    `gorm:"not null;column:after_log_redo_note_image"`
	AfterLogRedoStrokeData   string    `gorm:"not null;column:after_log_redo_stroke_data"`
	BeforeLogRedoStrokeCount int       `gorm:"not null;column:before_log_redo_stroke_count"`
	AfterLogRedoStrokeCount  int       `gorm:"not null;column:after_log_redo_stroke_count"`
	CreatedAt                time.Time `sql:"DEFALUT:current_timestamp;column:created_at"`
}