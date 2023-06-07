package controller

import (
	"github.com/YutoSekiguchi/ppundo/service"
	"github.com/labstack/echo/v4"
)

// 選択したオベジェクトを削除した回数を追加
func (ctrl Controller) HandlePostEraseSelectedObjectsCount(c echo.Context) error {
	var s service.EraseSelectedObjectsCountsService
	p, err := s.PostEraseSelectedObjectsCount(ctrl.Db, c)

	return Res(c, p, err)
}