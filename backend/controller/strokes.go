package controller

import (
	"github.com/labstack/echo/v4"
	"github.com/YutoSekiguchi/ppundo/service"
)

// idからストロークを取得
func (ctrl Controller) HandleGetStrokeByID(c echo.Context) error {
	var s service.StrokesService
	p, err := s.GetStrokeByID(ctrl.Db, c)

	return Res(c, p, err)
}

// nidから全てのストロークを取得
func (ctrl Controller) HandleGetStrokesByNID(c echo.Context) error {
	var s service.StrokesService
	p, err := s.GetStrokesByNID(ctrl.Db, c)

	return Res(c, p, err)
}

// POST
// ストロークの追加
func (ctrl Controller) HandlePostStrokes(c echo.Context) error {
	var s service.StrokesService
	p, err := s.PostStrokes(ctrl.Db, c)

	return Res(c, p, err)
}

// PUT
// 保存済にする
func (ctrl Controller) HandleUpdateNotSaveStrokes(c echo.Context) error {
	var s service.StrokesService
	p, err := s.UpdateNotSaveStrokes(ctrl.Db, c)

	return Res(c, p, err)
}

// DELETE 
// 保存済以外の削除
func (ctrl Controller) HandleDeleteNotSaveStrokes(c echo.Context) error {
	var s service.StrokesService
	p, err := s.DeleteNotSaveStrokes(ctrl.Db, c)

	return Res(c, p, err)
}