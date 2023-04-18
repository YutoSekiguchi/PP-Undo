package model

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
)

type StrokeData struct {
	Strokes []interface{} `json:"strokes" gorm:"not null;"`
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