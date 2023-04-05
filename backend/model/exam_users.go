package model

import "time"

type ExamUser struct {
	ID        int       `gorm:"primary_key;not null;autoIncrement:true"`
	Name      string    `gorm:"not null;column:name"`
	Password  string    `gorm:"not null;column:password"`
	Gender    string    `gorm:"not null;column:gender"`
	Age       int       `gorm:"not null;column:age"`
	CreatedAt time.Time `sql:"DEFALUT:current_timestamp;column:created_at"`
}