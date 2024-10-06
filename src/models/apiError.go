package models

type ApiError struct {
	HttpCode uint16  `json:"http_code"`
	Message  string  `json:"message"`
	Success  bool    `json:"success"`
	Reason   *string `json:"reason,omitempty"`
}
