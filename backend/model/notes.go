package model

import "time"

type Notes struct {
	ID                 int       `gorm:"primary_key;not null;autoIncrement:true"`
	NFID               int       `gorm:"not null;column:nfid"`
	UID                int       `gorm:"not null;column:uid"`
	Title              string    `gorm:"not null;column:title"`
	Width              float64   `gorm:"not null;column:width"`
	Height             float64   `gorm:"not null;column:height"`
	NoteImage          string    `gorm:"not null;column:note_image"`
	StrokeData         string    `gorm:"not null;column:stroke_data"`
	AvgPressure        float64   `gorm:"not null;column:avg_pressure"`
	AvgPressureList    string    `gorm:"not null;column:avg_pressure_list"`
	AllAvgPressureList string    `gorm:"not null;column:all_avg_pressure_list"`
	IsShowStrokeList   string    `gorm:"not null;column:is_show_stroke_list"`
	AllStrokeCount     int       `gorm:"not null;column:all_stroke_count"`
	StrokeCount        int       `gorm:"not null;column:stroke_count"`
	UndoCount          int       `gorm:"not null;column:undo_count"`
	RedoCount          int       `gorm:"not null;column:redo_count"`
	LogRedoCount       int       `gorm:"not null;column:log_redo_count"`
	PPUndoCount        int       `gorm:"not null;column:ppundo_count"`
	SliderValue        float64   `gorm:"not null;column:slider_value"`
	BackgroundImage    string    `gorm:"column:background_image"`
	CreatedAt          time.Time `sql:"DEFALUT:current_timestamp;column:created_at"`
}