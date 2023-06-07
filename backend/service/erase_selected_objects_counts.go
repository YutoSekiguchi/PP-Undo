package service

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type EraseSelectedObjectsCountsService struct{}

// POST
func (s EraseSelectedObjectsCountsService) PostEraseSelectedObjectsCount(db *gorm.DB, c echo.Context) (EraseSelectedObjectsCounts, error) {
	var esoc EraseSelectedObjectsCounts
	c.Bind(&esoc)

	if err := db.Create(&esoc).Error; err != nil {
		return esoc, err
	}
	return esoc, nil
}