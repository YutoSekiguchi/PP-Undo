package controller

import (
	"github.com/YutoSekiguchi/ppundo/service"
	"github.com/labstack/echo/v4"
)

// nidからlog_redoの回数を取得
func (ctrl Controller) HandleGetLogRedoCountsByNID(c echo.Context) error {
	var s service.LogRedoCountsService
	p, err := s.GetLogRedoCountsByNID(ctrl.Db, c)

	return Res(c, p, err)
}

// log_redoの回数を追加
func (ctrl Controller) HandlePostLogRedoCount(c echo.Context) error {
	var s service.LogRedoCountsService
	p, err := s.PostLogRedoCount(ctrl.Db, c)

	return Res(c, p, err)
}