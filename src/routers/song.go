package routers

import (
	"github.com/KT-Trez/syfi-api/src/controllers"
	"github.com/gorilla/mux"
)

func newSongRouter(r *mux.Router) {
	router := r.PathPrefix("/song").Subrouter()

	router.HandleFunc("/meta/{id}", controllers.GetSongMeta).Methods("GET")
	router.HandleFunc("/stream/{id}", controllers.GetSongStream).Methods("GET")
}
