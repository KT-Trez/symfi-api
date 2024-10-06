package models

type ApiSuccess struct {
	HttpCode uint16  `json:"http_code"`
	Message  string  `json:"message"`
	Meta     *string `json:"meta,omitempty"`
	Success  bool    `json:"success"`
}
