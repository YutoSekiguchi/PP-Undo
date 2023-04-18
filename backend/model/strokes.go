package model

import "time"

type Strokes struct {
	ID           int        `gorm:"primary_key;not null;autoIncrement:true"`
	UID          int        `gorm:"not null;column:uid"`
	NID          int        `gorm:"not null;column:nid"`
	StrokeData   StrokeData `gorm:"not null;column:stroke_data"`
	AvgPressure  float64    `gorm:"not null;column:avg_pressure"`
	PressureList string     `gorm:"not null;column:pressure_list"`
	Time         float64    `gorm:"column:time"`
	Mode         string     `gorm:"not null;column:mode"`
	Save         int        `gorm:"not null;column:save" `
	CreatedAt    time.Time  `sql:"DEFALUT:current_timestamp;column:created_at"`
}