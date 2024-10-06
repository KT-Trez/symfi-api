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

		fmt.Printf("%s %s %s", r.Method, r.RequestURI, duration)
	})
}
