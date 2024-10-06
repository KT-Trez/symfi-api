package routers

import (
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
)

func newSongRouter(r *mux.Router) {
	router := r.PathPrefix("/v3").Subrouter()

	router.HandleFunc("/song/{id}", func(writer http.ResponseWriter, request *http.Request) {
		vars := mux.Vars(request)

		songId := vars["id"]

		fmt.Fprintf(writer, "requested song: %s", songId)
	}).Methods("GET")

}
