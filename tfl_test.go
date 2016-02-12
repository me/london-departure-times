package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"
)

var (
	mux *http.ServeMux

	client *TFLClient

	server *httptest.Server
)

func setupTFL() {
	mux = http.NewServeMux()
	server = httptest.NewServer(mux)

	client = NewTFLClient(nil, "", "")
	url, _ := url.Parse(server.URL)
	client.BaseURL = url
}

func teardownTFL() {
	server.Close()
}

func TestNewClient(t *testing.T) {
	c := NewTFLClient(nil, "", "")
	if c.BaseURL.String() != tflDefaultBaseURL {
		t.Errorf("NewClient BaseURL = %v, expected %v", c.BaseURL.String(), tflDefaultBaseURL)
	}
}

func TestTFLClient_Request_httpError(t *testing.T) {
	setupTFL()
	defer teardownTFL()

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.Error(w, "Bad Request", 400)
	})

	_, err := client.Request(*client.BaseURL, nil)

	if err == nil {
		t.Error("Expected HTTP 400 error.")
	}
}

func TestTFLClient_Request_success(t *testing.T) {
	setupTFL()
	defer teardownTFL()

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "OK")
	})

	_, err := client.Request(*client.BaseURL, nil)

	if err != nil {
		t.Error("Expected successful request")
	}
}
