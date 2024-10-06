FROM golang:1.23

LABEL authors="kttrez"
LABEL name="symfi-api"

EXPOSE 5000

WORKDIR /usr/src/app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN make build

CMD ["./symfi.was.org.pl"]
