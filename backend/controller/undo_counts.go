package controller

import (
	"github.com/YutoSekiguchi/ppundo/service"
	"github.com/labstack/echo/v4"
)

// nidからundo回数を取得
func (ctrl Controller) HandleGetUndoCountsByNID(c echo.Context) error {
	var s service.UndoCountsService
	p, err := s.GetUndoCountsByNID(ctrl.Db, c)

	return Res(c, p, err)
}

// uidからundo回数を取得
func (ctrl Controller) HandleGetUndoCountsByUID(c echo.Context) error {
	var s service.UndoCountsService
	p, err := s.GetUndoCountsByUID(ctrl.Db, c)

	return Res(c, p, err)
}

// undo回数の追加
func (ctrl Controller) HandlePostUndoCounts(c echo.Context) error {
	var s service.UndoCountsService
	p, err := s.PostUndoCounts(ctrl.Db, c)

	return Res(c, p, err)
}