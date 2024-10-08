package controllers

import (
	"encoding/json"
	"fmt"
	"github.com/KT-Trez/syfi-api/src/models"
	"github.com/gorilla/mux"
	"github.com/kkdai/youtube/v2"
	"io"
	"net/http"
)

func GetSongMeta(res http.ResponseWriter, req *http.Request) {
	client := youtube.Client{}

	vars := mux.Vars(req)

	id := vars["id"]
	if id == "" {
		fmt.Println("id param is invalid")
		return
	}

	_, err := client.GetVideo(id)
	if err != nil {
		fmt.Println("video does not exist", err)
		return
	}

	proto := "http"
	if req.TLS != nil {
		proto = "https"
	}

	uri := fmt.Sprintf("%s://%s/v3/song/stream/%s", proto, req.Host, id)

	res.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(res).Encode(models.ApiSuccess{
		HttpCode: http.StatusOK,
		Message:  "Video found",
		Meta:     &uri,
		Success:  true,
	})

	if err != nil {
		return
	}
}

func GetSongStream(res http.ResponseWriter, req *http.Request) {
	client := youtube.Client{}

	vars := mux.Vars(req)
	id := vars["id"]

	if len(id) == 0 {
		fmt.Println("id param is invalid")
		return
	}

	video, err := client.GetVideo(id)

	if err != nil {
		fmt.Println("failed to get video")
		return
	}

	formats := video.Formats.Itag(251)

	if len(formats) == 0 {
		fmt.Println("no video with provided itag")
		return
	}

	stream, _, err := client.GetStream(video, &formats[0])
	defer func(stream io.ReadCloser) {
		err := stream.Close()
		if err != nil {
			fmt.Printf("stream close failed with %s", err)
		}
	}(stream)

	res.Header().Set("Content-Type", "audio/webm")
	_, err = io.Copy(res, stream)

	if err != nil {
		fmt.Println("failed to stream song")
		return
	}
}
