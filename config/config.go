package config

import (
	"fmt"
	"os"
)

var Port = func() string {
	if port := os.Getenv("PORT"); port != "" {
		return fmt.Sprintf(":%s", port)
	}

	return ":5000"
}()
var Version string
