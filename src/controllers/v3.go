package controllers

import (
	"fmt"
	"net/http"
)

func GET_Ping(w http.ResponseWriter, r *http.Request) {
	fmt.Println("ping")
}
