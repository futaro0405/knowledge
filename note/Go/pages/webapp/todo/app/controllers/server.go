package controllers

import "net/http"

func StartMainServer() error {
	http.HandleFunc("/", top)
	return http.ListenAndServe(":"+config.Config.Port, nil)
}
