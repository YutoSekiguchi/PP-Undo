package model

import "time"

type PPUndoCounts struct {
	ID                      int       `gorm:"primary_key;not null;autoIncrement:true"`
	UID                     int       `gorm:"not null;column:uid"`
	NID                     int       `gorm:"not null;column:nid"`
	BeforePPUndoStrokeData  StrokeData    `gorm:"not null;column:before_ppundo_stroke_data"`
	BeforePPUndoImageData   string    `gorm:"not null;column:before_ppundo_image_data"`
	BeforePPUndoStrokeCount int       `gorm:"not null;column:before_ppundo_stroke_count"`
	AfterPPUndoStrokeCount  int       `gorm:"not null;column:after_ppundo_stroke_count"`
	CreatedAt               time.Time `sql:"DEFALUT:current_timestamp;column:created_at"`
}