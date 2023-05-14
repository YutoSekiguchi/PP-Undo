package service

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type NoteFoldersService struct{}

// GET
// フォルダを全て取得
func (s NoteFoldersService) GetAllNoteFolders(db *gorm.DB) ([]NoteFolders, error) {
	var nf []NoteFolders

	if err := db.Find(&nf).Error; err != nil {
		return nil, err
	}
	return nf, nil
}

// idからフォルダを取得
func (s NoteFoldersService) GetNoteFolderByID(db *gorm.DB, c echo.Context) (*NoteFolders, error) {
	nf := new(NoteFolders)
	id := c.Param("id")

	if err := db.Raw("SELECT * FROM `note_folders` WHERE id = ?", id).Scan(&nf).Error; err != nil {
		return nil, err
	}
	return nf, nil
}

// uidからフォルダを全て取得
func (s NoteFoldersService) GetNoteFoldersByUID(db *gorm.DB, c echo.Context) ([]NoteFolders, error) {
	var nf []NoteFolders
	uid := c.Param("uid")

	if err := db.Raw("SELECT * FROM `note_folders` WHERE uid = ?", uid).Scan(&nf).Error; err != nil {
		return nil, err
	}
	return nf, nil
}

// uidとparent_nfidからフォルダを全て取得
func (s NoteFoldersService) GetNoteFoldersByUIDAndParentNFID(db *gorm.DB, c echo.Context) ([]NoteFolders, error) {
	var nf []NoteFolders
	uid := c.Param("uid")
	pnfid := c.Param("pnfid")

	if err := db.Raw("SELECT * FROM `note_folders` WHERE uid = ? AND parent_nfid = ?", uid, pnfid).Scan(&nf).Error; err != nil {
		return nil, err
	}
	return nf, nil
}


func reverse(slice []NoteFolders) []NoteFolders {
	for i := 0; i < len(slice)/2; i++ {
			j := len(slice) - i - 1
			slice[i], slice[j] = slice[j], slice[i]
	}
	return slice
}

// idから構造を取得
func (s NoteFoldersService) GetNoteFoldersTree(db *gorm.DB, c echo.Context) ([]NoteFolders, error) {
	var nf []NoteFolders
	var tmp []NoteFolders
	id := c.Param("id")

	
	if err := db.Raw("SELECT * FROM `note_folders` WHERE id = ?", id).Scan(&tmp).Error; err != nil {
		return nil, err
	}

	nf = append(nf, tmp[0])

	i := tmp[0].ParentNFID
	for i != 0 {
		if err := db.Raw("SELECT * FROM `note_folders` WHERE id = ?", tmp[0].ParentNFID).Scan(&tmp).Error; err != nil {
			return nil, err
		}
		i = tmp[0].ParentNFID
		nf = append(nf, tmp[0])
	}
	res := reverse(nf);
	return res, nil
}

// POST
// フォルダの追加
func (s NoteFoldersService) PostNoteFolder(db *gorm.DB, c echo.Context) (NoteFolders, error) {
	var noteFolders NoteFolders
	c.Bind(&noteFolders)

	if err := db.Create(&noteFolders).Error; err != nil {
		return noteFolders, err
	}
	return noteFolders, nil
}

// PUT
func (s NoteFoldersService) UpdateNoteFolderByID(db *gorm.DB, c echo.Context) (*NoteFolders, error) {
	var nf *NoteFolders
	id := c.Param("id")
	if err := db.Raw("SELECT * FROM `note_folders` WHERE id = ? LIMIT 1", id).Scan(&nf).Error; err != nil {
		return nil, err
	}
	if err := c.Bind(&nf); err != nil {
		return nil, err
	}
	db.Save(&nf)

	return nf, nil
}
// 名前の変更
func (s NoteFoldersService) UpdateNoteFolderTitleByID(db *gorm.DB, c echo.Context) (*NoteFolders, error) {
	var nf *NoteFolders
	c.Bind(&nf)
	
	if err := db.Model(&NoteFolders{}).Where("id = ?", nf.ID).Update("name", nf.Name).Error; err != nil {
		return nil, err
	}
	return nf, nil
}

// DELETE
func (s NoteFoldersService) DeleteNoteFolderByID(db *gorm.DB, c echo.Context) (*NoteFolders, error) {
	var nf *NoteFolders
	id := c.Param("id")

	if err := db.Table("note_folders").Where("id = ?", id).Delete(&nf).Error; err != nil {
		return nil, err
	}

	return nil, nil
}