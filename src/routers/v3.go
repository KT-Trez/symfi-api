package routers

import (
	"github.com/KT-Trez/syfi-api/src/controllers"
	"github.com/gorilla/mux"
)

func NewV3Router(r *mux.Router) {
	router := r.PathPrefix("/v3").Subrouter()

	newSongRouter(router)

	router.HandleFunc("/ping", controllers.GetPing)
}
