package model

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
)

type StrokeData struct {
	Strokes StrokeDataStrokes `json:"strokes" gorm:"not null;"`
}

type StrokeDataStrokes struct {
	Data []interface{} `json:"data" gorm:"not null;"`
	Pressure []float64 `json:"pressure"`
	Svg string `json:"svg"`
}

func (s StrokeData) Value() (driver.Value, error) {
	bytes, err := json.Marshal(s)
	if err != nil {
		return nil, err
	}
	return string(bytes), nil
}

func (s *StrokeData) Scan(value interface{}) error {
	switch v := value.(type) {
	case string:
		return json.Unmarshal([]byte(v), s)
	case []byte:
		return json.Unmarshal(v, s)
	default:
		return fmt.Errorf("unsupported type: %T",value)
	}
}

type ClientLogData struct {
	CreateTime string `json:"createTime" gorm:"not null;"`
	Image string `json:"image" gorm:"not null;"`
	SliderValue float64 `json:"sliderValue" gorm:"not null;"`
	Strokes []interface{} `json:"strokes" gorm:"not null;"`
}

func (s ClientLogData) Value() (driver.Value, error) {
	bytes, err := json.Marshal(s)
	if err != nil {
		return nil, err
	}
	return string(bytes), nil
}

func (s *ClientLogData) Scan(value interface{}) error {
	switch v := value.(type) {
	case string:
		return json.Unmarshal([]byte(v), s)
	case []byte:
		return json.Unmarshal(v, s)
	default:
		return fmt.Errorf("unsupported type: %T",value)
	}
}