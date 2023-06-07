package model

import "time"

type UndoCounts struct {
	ID                   int       `gorm:"primary_key;not null;autoIncrement:true"`
	UID                  int       `gorm:"not null;column:uid"`
	NID                  int       `gorm:"not null;column:nid"`
	BeforeUndoNoteImage  string    `gorm:"not null;column:before_undo_note_image"`
	BeforeUndoStrokeData StrokeData    `gorm:"not null;column:before_undo_stroke_data"`
	AfterUndoNoteImage   string    `gorm:"not null;column:after_undo_note_image"`
	AfterUndoStrokeData  StrokeData   `gorm:"not null;column:after_undo_stroke_data"`
	LeftStrokeCount      int       `gorm:"not null;column:left_stroke_count"`
	Now                  float64   `gorm:"column:now"`
	CreatedAt            time.Time `sql:"DEFALUT:current_timestamp;column:created_at"`
}