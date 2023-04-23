package controller

import (
	"github.com/YutoSekiguchi/ppundo/service"
	"github.com/labstack/echo/v4"
)

// nid から ppundo回数を取得
func (ctrl Controller) HandleGetPPUndoCountsByNID(c echo.Context) error {
	var s service.PPUndoCountsService
	p, err := s.GetPPUndoCountsByNID(ctrl.Db, c)

	return Res(c, p, err)
}

// ppundo回数の追加
func (ctrl Controller) HandlePostPPUndoCount(c echo.Context) error {
	var s service.PPUndoCountsService
	p, err := s.PostPPUndoCount(ctrl.Db, c)

	return Res(c, p ,err)
}