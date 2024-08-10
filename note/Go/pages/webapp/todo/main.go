package main

import (
	"fmt"
)

func main() {
	fmt.Println(models.Db)
	user := models.GetUserByEmail("test@example.com")
}
