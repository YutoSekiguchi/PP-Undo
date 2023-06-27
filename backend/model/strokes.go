package model

import "time"

type Strokes struct {
	ID           int        `gorm:"primary_key;not null;autoIncrement:true"`
	UID          int        `gorm:"not null;column:uid"`
	NID          int        `gorm:"not null;column:nid"`
	StrokeData   StrokeData `gorm:"not null;column:stroke_data"`
	TransformPressure float64 `gorm:"column:transform_pressure"`;
	AvgPressure  float64    `gorm:"not null;column:avg_pressure"`
	PointDataList PointData `gorm:"not null;column:point_data_list"`
	PressureList string     `gorm:"not null;column:pressure_list"`
	Time         float64    `gorm:"column:time"`
	StartTime    float64    `gorm:"column:start_time"`
	EndTime      float64    `gorm:"column:end_time"`
	Mode         string     `gorm:"not null;column:mode"`
	Save         int        `gorm:"not null;column:save" `
	GroupNum     int        `gorm:"column:group_num"`
	CreatedAt    time.Time  `sql:"DEFALUT:current_timestamp;column:created_at"`
}