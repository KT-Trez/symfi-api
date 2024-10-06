package controllers

import (
	"fmt"
	"github.com/gorilla/mux"
	"github.com/kkdai/youtube/v2"
	"io"
	"net/http"
)

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
	defer stream.Close()

	res.Header().Set("Content-Type", "audio/webm")
	_, err = io.Copy(res, stream)

	if err != nil {
		fmt.Println("failed to stream song")
		return
	}
}
