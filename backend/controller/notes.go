package controller

import (
	"github.com/labstack/echo/v4"
	"github.com/YutoSekiguchi/ppundo/service"
)


// ノートを全て取得
func (ctrl Controller) HandleGetAllNotes(c echo.Context) error {
	var s service.NotesService
	p, err := s.GetAllNotes(ctrl.Db)

	return Res(c, p, err)
}

// idからノートの取得
func (ctrl Controller) HandleGetNoteByID(c echo.Context) error {
	var s service.NotesService
	p, err := s.GetNoteByID(ctrl.Db, c)

	return Res(c, p, err)
}

// nfidからノートを全て取得
func (ctrl Controller) HandleGetNotesByNFID(c echo.Context) error {
	var s service.NotesService
	p, err := s.GetNotesByNFID(ctrl.Db, c)

	return Res(c, p, err)
}

// nfidとuidからノートを全て取得
func (ctrl Controller) HandleGetNotesByNFIDAndUID(c echo.Context) error {
	var s service.NotesService
	p, err := s.GetNotesByNFIDAndUID(ctrl.Db, c)

	return Res(c, p, err)
}

// ノートの追加
func (ctrl Controller) HandlePostNote(c echo.Context) error {
	var s service.NotesService
	p, err := s.PostNote(ctrl.Db, c)

	return Res(c, p, err)
}

// ノートの編集
func (ctrl Controller) HandleUpdateNoteByID(c echo.Context) error {
	var s service.NotesService
	p, err := s.UpdateNoteByID(ctrl.Db, c)

	return Res(c, p, err)
}
// ノートのタイトル変更
func (ctrl Controller) HandleUpdateNoteTitleByID(c echo.Context) error {
	var s service.NotesService
	p, err := s.UpdateNoteTitleByID(ctrl.Db, c)

	return Res(c, p, err)
}


// ノートの削除
func (ctrl Controller) HandleDeleteNoteByID(c echo.Context) error {
	var s service.NotesService
	p, err := s.DeleteNoteByID(ctrl.Db, c)

	return Res(c, p, err)
}