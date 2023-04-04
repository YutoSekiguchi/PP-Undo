package model

import "time"

type WatchLogsCounts struct {
	ID           int       `gorm:"primary_key;not null;autoIncrement:true"`
	UID          int       `gorm:"not null;column:uid"`
	NID          int       `gorm:"not null;column:nid"`
	LogCount     int       `gorm:"not null;column:log_count"`
	WatchTime    float64   `gorm:"not null;column:watch_time"`
	CreatedAt    time.Time `sql:"DEFALUT:current_timestamp;column:created_at"`
}