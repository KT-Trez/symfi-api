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

	fmt.Printf("starting server version %s", config.Version)
	err := http.ListenAndServe(":5000", r)
	if err != nil {
		panic("failed to start the server")
	}
}
