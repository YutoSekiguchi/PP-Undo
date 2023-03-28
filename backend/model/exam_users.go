package model

import "time"

type ExamUser struct {
	ID        int       `gorm:"primary_key;not null;autoIncrement:true"`
	Name      string    `gorm:"type:text;not null"`
	Password  string    `gorm:"type:text;not null"`
	Gender    string    `gorm:"type:text;not null"`
	Age       int       `gorm:"not null;column:age"`
	CreatedAt time.Time `sql:"DEFALUT:current_timestamp;column:created_at"`
}