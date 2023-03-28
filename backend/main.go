package main

import (
	"github.com/YutoSekiguchi/ppundo/router"
	"github.com/YutoSekiguchi/ppundo/util"
)

func main() {
	db := util.InitDb()
	router.InitRouter(db)
}