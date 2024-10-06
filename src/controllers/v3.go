package controllers

import (
	"encoding/json"
	"fmt"
	"github.com/KT-Trez/syfi-api/config"
	"github.com/KT-Trez/syfi-api/src/models"
	"net/http"
)

func GetPing(w http.ResponseWriter, _ *http.Request) {
	data := models.ApiSuccess{
		HttpCode: 200,
		Message:  fmt.Sprintf("API %s is running", config.Version),
		Success:  true,
	}

	w.Header().Set("Content-Type", "application/json")
	err := json.NewEncoder(w).Encode(&data)

	if err != nil {
		fmt.Println("failed to send ping")
	}
}
