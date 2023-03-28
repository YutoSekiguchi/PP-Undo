package controller

import (
	"github.com/labstack/echo/v4"
	"github.com/YutoSekiguchi/ppundo/service"
)

// ユーザ一覧の取得
func (ctrl Controller) HandleGetExamUserList(c echo.Context) error {
	var s service.ExamUserService
	p, err := s.GetExamUserList(ctrl.Db)

	return Res(c, p, err)
}

// 名前とパスワードからユーザを取得
func (ctrl Controller) HandleGetExamUserByNameAndPwd(c echo.Context) error {
	var s service.ExamUserService
	p, err := s.GetExamUserByNameAndPwd(ctrl.Db, c)

	return Res(c, p, err)
}

// idからユーザを取得
func (ctrl Controller) HandleGetExamUserByID(c echo.Context) error {
	var s service.ExamUserService
	p, err := s.GetExamUserByID(ctrl.Db, c)

	return Res(c, p, err)
}

// ユーザの追加
func (ctrl Controller) HandlePostExamUser(c echo.Context) error {
	var s service.ExamUserService
	p, err := s.PostExamUser(ctrl.Db, c)
	
	return Res(c, p, err)
}