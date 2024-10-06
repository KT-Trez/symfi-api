package config

import "os"

var Port = func() string {
	if port := os.Getenv("APP_PORT"); port != "" {
		return port
	}

	return ":5000"
}()
var Version string
