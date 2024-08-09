package main

import (
	"fmt"
)

func main() {
	fmt.Println(models.Db)

	/*
		u := &models.User{}
		u.Name = "test2"
		u.Email = "test2@example.com"
		u.PassWord = "testtest"
		u.CreateUser()
	*/

	/*
		u, _ := models.GetUser(l)
		u.Name = "Test2"
		u.Email = "test2@example.com"
		u.UpdateUser()
	*/

	/*
		u, _ = models.GetUser(l)
		u.DeleteUser()
	*/

	/*
		user, _ := models.GetUser(3)
		user.CreateTodo("First Todo")
	*/

	/*
		todos , _ = models.GetTodos()
		for _, v := range todos {
			fmt.Println(v)
		}
	*/
}
