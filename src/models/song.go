package models

type Song struct {
	Channel *struct {
		Name string `json:"name"`
		Url  string `json:"url"`
	} `json:"channel"`

	Duration *struct {
		Count uint32 `json:"count"`
		Label string `json:"label"`
	} `json:"duration"`

	Id        string `json:"id"`
	Name      string `json:"name"`
	Published string `json:"published"`
	Thumbnail string `json:"thumbnail"` // might be nullable

	Views *struct {
		Count uint32 `json:"count"`
		Label string `json:"label"`
	} `json:"views"`
}
