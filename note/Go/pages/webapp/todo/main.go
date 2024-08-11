package main

import (
	"fmt"
	"log"
)

func main() {
	fmt.Println(models.Db)
	user := models.GetUserByEmail("test@example.com")
	fmt.Println(user)

	session, err := user.CreateSession()
	if err != nil {
		log.Println(err)
	}
	fmt.Println(session)

	valid, _ := session.CheckSession()
	fmt.Println(valid)
}
