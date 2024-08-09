package main

import (
	"fmt"
)

func main() {
	fmt.Println(models.Db)
	controllers.StartMainServer()
}
