package model

import "time"

type PPUndoCounts struct {
	ID                      int       `gorm:"primary_key;not null;autoIncrement:true"`
	UID                     int       `gorm:"not null;column:uid"`
	NID                     int       `gorm:"not null;column:nid"`
	AfterPPUndoStrokeData  StrokeData    `gorm:"not null;column:after_ppundo_stroke_data"`
	AfterPPUndoImageData    string    `gorm:"not null;column:after_ppundo_image_data"`
	BeforePPUndoStrokeCount int       `gorm:"not null;column:before_ppundo_stroke_count"`
	AfterPPUndoStrokeCount  int       `gorm:"not null;column:after_ppundo_stroke_count"`
	Now                     float64   `gorm:"column:now"`
	CreatedAt               time.Time `sql:"DEFALUT:current_timestamp;column:created_at"`
}