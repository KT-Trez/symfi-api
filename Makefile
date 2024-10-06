serve:
	go build -o mybinary -ldflags="-X symfi.was.org.pl/config.Version=$(git describe --always --long --dirty)" main.go

OUT := symfi.was.org.pl
PKG := github.com/KT-Trez/syfi-api
VERSION := $(shell git describe --always --dirty)
PKG_LIST := $(shell go list ${PKG}/... | grep -v /vendor/)
GO_FILES := $(shell find . -name '*.go' | grep -v /vendor/)

clean:
	-@rm ${OUT} ${OUT}-v*

build:
	go build -o ${OUT} -ldflags="-X ${PKG}/config.Version=${VERSION}" ${PKG}

serve: build
	./${OUT}





