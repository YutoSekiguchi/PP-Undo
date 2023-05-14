package controller

import (
	"github.com/labstack/echo/v4"
	"github.com/YutoSekiguchi/ppundo/service"
)

// フォルダを全て取得
func (ctrl Controller) HandleGetAllNoteFolders(c echo.Context) error {
	var s service.NoteFoldersService
	p, err := s.GetAllNoteFolders(ctrl.Db)

	return Res(c, p, err)
}

// idからフォルダを取得
func (ctrl Controller) HandleGetNoteFolderByID(c echo.Context) error {
	var s service.NoteFoldersService
	p, err := s.GetNoteFolderByID(ctrl.Db, c)

	return Res(c, p, err)
}

// uidからフォルダをすべて取得
func (ctrl Controller) HandleGetNoteFoldersByUID(c echo.Context) error {
	var s service.NoteFoldersService
	p, err := s.GetNoteFoldersByUID(ctrl.Db, c)

	return Res(c, p, err)
}

// uidとparent_nfidからフォルダを全て取得
func (ctrl Controller) HandleGetNoteFoldersByUIDAndParentNFID(c echo.Context) error {
	var s service.NoteFoldersService
	p, err := s.GetNoteFoldersByUIDAndParentNFID(ctrl.Db, c)

	return Res(c, p, err)
}

// idから構造取得
func (ctrl Controller) HandleGetNoteFoldersTree(c echo.Context) error {
	var s service.NoteFoldersService
	p, err := s.GetNoteFoldersTree(ctrl.Db, c)

	return Res(c, p, err)
}

// フォルダの追加
func (ctrl Controller) HandlePostNoteFolder(c echo.Context) error {
	var s service.NoteFoldersService
	p, err := s.PostNoteFolder(ctrl.Db, c)

	return Res(c, p, err)
}

// フォルダの編集
func (ctrl Controller) HandleUpdateNoteFolderByID(c echo.Context) error {
	var s service.NoteFoldersService
	p, err := s.UpdateNoteFolderByID(ctrl.Db, c)

	return Res(c, p, err)
}
// フォルダの名前を変更
func (ctrl Controller) HandleUpdateNoteFolderTitleByID(c echo.Context) error {
	var s service.NoteFoldersService
	p, err := s.UpdateNoteFolderTitleByID(ctrl.Db, c)

	return Res(c, p, err)
}

// フォルダの削除
func (ctrl Controller) HandleDeleteNoteFolderByID(c echo.Context) error {
	var s service.NoteFoldersService
	p, err := s.DeleteNoteFolderByID(ctrl.Db , c)

	return Res(c, p, err)
}