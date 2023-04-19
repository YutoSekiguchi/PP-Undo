package controller

import (
	"github.com/YutoSekiguchi/ppundo/service"
	"github.com/labstack/echo/v4"
)

// idからlogの取得
func (ctrl Controller) HandleGetLogByID(c echo.Context) error {
	var s service.LogsService
	p, err := s.GetLogByID(ctrl.Db, c)

	return Res(c, p, err)
}


// nidからlogの取得
func (ctrl Controller) HandleGetLogsByNID(c echo.Context) error {
	var s service.LogsService
	p, err := s.GetLogsByNID(ctrl.Db, c)

	return Res(c, p ,err)
}

// post
func (ctrl Controller) HandlePostLog(c echo.Context) error {
	var s service.LogsService
	p, err := s.PostLog(ctrl.Db, c)

	return Res(c, p, err)
}