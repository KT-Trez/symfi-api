package main

import (
	"fmt"
	"github.com/KT-Trez/syfi-api/config"
	"github.com/KT-Trez/syfi-api/src/middleware"
	"github.com/KT-Trez/syfi-api/src/routers"
	"github.com/gorilla/mux"
	"net/http"
)

func main() {
	r := mux.NewRouter()

	r.Use(middleware.LogRequest)
	routers.NewV3Router(r)

	fmt.Printf("Status: [STARTING], PORT: [%s], Version: [%s]\n", config.Port, config.Version)
	err := http.ListenAndServe(config.Port, r)

	if err != nil {
		panic(err)
	}
}
