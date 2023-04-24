package controller

import (
	"github.com/YutoSekiguchi/ppundo/service"
	"github.com/labstack/echo/v4"
)

// nidからログを見た回数を取得
func (ctrl Controller) HandleGetWatchLogsCountsByNID(c echo.Context) error {
	var s service.WatchLogCountsService
	p, err := s.GetWatchLogsCountsByNID(ctrl.Db, c)

	return Res(c, p, err)
}

// ログを見た回数を追加
func (ctrl Controller) HandlePostWatchLogsCount(c echo.Context) error {
	var s service.WatchLogCountsService
	p, err := s.PostWatchLogsCount(ctrl.Db, c)

	return Res(c, p, err)
}