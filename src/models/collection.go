package models

type Collection struct {
	HasMore bool   `json:"has_more"`
	Limit   uint   `json:"limit"`
	Objects []Song `json:"objects"`
	Offset  uint   `json:"offset"`
}
