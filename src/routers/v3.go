package routers

import (
	"github.com/gorilla/mux"
	"symfi.was.org.pl/src/controllers"
)

func NewV3Router(r *mux.Router) {
	router := r.PathPrefix("/v3").Subrouter()

	newSongRouter(router)

	router.HandleFunc("/ping", controllers.GET_Ping)
}
