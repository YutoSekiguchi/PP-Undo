package controller

import (
	"github.com/YutoSekiguchi/ppundo/service"
	"github.com/labstack/echo/v4"
)

// nidからlogの取得
func (ctrl Controller) HandleGetClientLogsByNID(c echo.Context) error {
	var s service.ClientLogsService
	p, err := s.GetClientLogsByNID(ctrl.Db, c)

	return Res(c, p ,err)
}

// post
func (ctrl Controller) HandlePostClientLog(c echo.Context) error {
	var s service.ClientLogsService
	p, err := s.PostClientLog(ctrl.Db, c)

	return Res(c, p, err)
}