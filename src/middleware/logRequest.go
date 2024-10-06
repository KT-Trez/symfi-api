package middleware

import (
	"fmt"
	"net/http"
	"time"
)

func LogRequest(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		h.ServeHTTP(w, r)
		duration := time.Since(start)

		fmt.Printf("%s %s %s %s\n", r.Method, r.RequestURI, r.RemoteAddr, duration)
	})
}
