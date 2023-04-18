package controller

import (
	"github.com/YutoSekiguchi/ppundo/service"
	"github.com/labstack/echo/v4"
)

// nidからredo回数を取得
func (ctrl Controller) HandleGetRedoCountsByNID(c echo.Context) error {
	var s service.RedoCountsService
	p, err := s.GetRedoCountsByNID(ctrl.Db, c)

	return Res(c, p, err)
}

// uidからredo回数を取得
func (ctrl Controller) HandleGetRedoCountsByUID(c echo.Context) error {
	var s service.RedoCountsService
	p, err := s.GetRedoCountsByUID(ctrl.Db, c)

	return Res(c, p, err)
}

// redo回数の追加
func (ctrl Controller) HandlePostRedoCounts(c echo.Context) error {
	var s service.RedoCountsService
	p, err := s.PostRedoCounts(ctrl.Db, c)

	return Res(c, p, err)
}