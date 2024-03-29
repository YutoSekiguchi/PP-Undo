package model

import "time"

type ClientLogs struct {
	ID                       int       `gorm:"primary_key;not null;autoIncrement:true"`
	NID                      int       `gorm:"not null;column:nid"`
	Data                     ClientLogData    `gorm:"not null;column:data"`
	CreatedAt                time.Time `sql:"DEFALUT:current_timestamp;column:created_at"`
}

