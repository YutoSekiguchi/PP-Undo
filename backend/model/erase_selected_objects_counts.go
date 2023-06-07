package model

import "time"

type EraseSelectedObjectsCounts struct {
	ID                       int       `gorm:"primary_key;not null;autoIncrement:true"`
	UID                      int       `gorm:"not null;column:uid"`
	NID                      int       `gorm:"not null;column:nid"`
	BeforeEraseSelectedObjectsNoteImage   string    `gorm:"not null;column:before_erase_selected_objects_note_image"`
	BeforeEraseSelectedObjectsStrokeData  StrokeData    `gorm:"not null;column:before_erase_selected_objects_stroke_data"`
	AfterEraseSelectedObjectsNoteImage    string    `gorm:"not null;column:after_erase_selected_objects_note_image"`
	AfterEraseSelectedObjectsStrokeData   StrokeData    `gorm:"not null;column:after_erase_selected_objects_stroke_data"`
	BeforeEraseSelectedObjectsStrokeCount int       `gorm:"not null;column:before_erase_selected_objects_stroke_count"`
	AfterEraseSelectedObjectsStrokeCount  int       `gorm:"not null;column:after_erase_selected_objects_stroke_count"`
	Now                      float64   `gorm:"column:now"`
	CreatedAt                time.Time `sql:"DEFALUT:current_timestamp;column:created_at"`
}