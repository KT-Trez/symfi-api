package main

import (
	"github.com/gorilla/mux"
	"net/http"
	"symfi.was.org.pl/src/middleware"
	"symfi.was.org.pl/src/routers"
)

func main() {
	r := mux.NewRouter()

	r.Use(middleware.LogRequest)
	routers.NewV3Router(r)

	http.ListenAndServe(":5000", r)
}
