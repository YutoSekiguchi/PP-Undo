package model

import "time"

type Logs struct {
	ID                       int       `gorm:"primary_key;not null;autoIncrement:true"`
	UID                      int       `gorm:"not null;column:uid"`
	NID                      int       `gorm:"not null;column:nid"`
	StrokeData               StrokeData    `gorm:"not null;column:stroke_data"`
	LogImage                 string    `gorm:"not null;column:log_image"`
	PressureList             string    `gorm:"not null;column:pressure_list"`
	AvgPressureList          string    `gorm:"not null;column:avg_pressure_list"`
	Save                     int       `gorm:"not null;column:save"`
	SliderValue              float64   `gorm:"not null;column:slider_value"`
	BeforeLogRedoSliderValue float64   `gorm:"not null;column:before_log_redo_slider_value"`
	CreatedAt                time.Time `sql:"DEFALUT:current_timestamp;column:created_at"`
}