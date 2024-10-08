package config

import (
	"fmt"
	"os"
)

var IsStreamingSupported = func() bool {
	if isSupported := os.Getenv("IS_STREAMING_SUPPORTED"); isSupported != "" {
		return isSupported == "true"
	}

	return true
}()
var Port = func() string {
	if port := os.Getenv("PORT"); port != "" {
		return fmt.Sprintf(":%s", port)
	}

	return ":5000"
}()
var Version string
