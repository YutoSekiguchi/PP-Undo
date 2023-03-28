package service

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type ExamUserService struct{}

// GET
// ユーザを全て取得
func (s ExamUserService) GetExamUserList(db *gorm.DB) ([]ExamUser, error) {
	var u []ExamUser

	if err := db.Find(&u).Error; err != nil {
		return nil, err
	}
	return u, nil
}

// 名前とパスワードからユーザを取得
func (s ExamUserService) GetExamUserByNameAndPwd(db *gorm.DB, c echo.Context) (*ExamUser, error) {
	u := new(ExamUser)
	name := c.QueryParam("Name")
	password := c.QueryParam("Password")
	if err := db.Raw("SELECT * FROM `exam_users` WHERE name = ? AND password = ? LIMIT 1", name, password).Scan(&u).Error; err != nil {
		return nil, err
	}
	if (u.ID == 0) {
		return nil, nil
	}
	return u, nil
}

// idからユーザを取得
func (s ExamUserService) GetExamUserByID(db *gorm.DB, c echo.Context) (*ExamUser, error) {
	u := new(ExamUser)
	id := c.Param("id")

	if err := db.Raw("SELECT * FROM `exam_users` WHERE id = ? LIMIT 1", id).Scan(&u).Error; err != nil {
		return nil, err
	}
	if (u.ID == 0) {
		return nil, nil
	}
	return u, nil
}

// POST
// ユーザ追加
func (s ExamUserService) PostExamUser(db *gorm.DB, c echo.Context) (ExamUser, error) {
	var examUser ExamUser
	c.Bind(&examUser)

	if err := db.Create(&examUser).Error; err != nil {
		return examUser, err
	}
	return examUser, nil
}