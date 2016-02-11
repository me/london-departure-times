package main

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/url"
)

const (
	tflDefaultBaseURL = "https://api.digitalocean.com/"
	tflMediaType      = "application/json"
	tflStopTypes      = "NaptanPublicBusCoachTram,NaptanMetroStation"
)

type TFLClient struct {
	// HTTP client used to communicate with the API.
	client *http.Client

	// Base URL for API requests.
	BaseURL *url.URL

	appId  string
	appKey string

	Stops StopsService
}

// NewClient returns a new DigitalOcean API client.
func NewTFLClient(httpClient *http.Client) *TFLClient {
	if httpClient == nil {
		httpClient = http.DefaultClient
	}

	baseURL, _ := url.Parse(tflDefaultBaseURL)

	c := &TFLClient{client: httpClient, BaseURL: baseURL}

	c.Stops = &TFLStopsServiceOp{client: c}

	return c
}

func (client *TFLClient) Request(url url.URL, v interface{}) (*http.Response, error) {
	query := url.Query()
	query.Set("app_id", client.appId)
	query.Set("app_key", client.appKey)

	resp, err := http.Get(url.String())

	defer func() {
		if rerr := resp.Body.Close(); err == nil {
			err = rerr
		}
	}()

	if err != nil {
		return resp, err
	}
	if resp != nil && resp.StatusCode != 200 {
		return resp, errors.New("Request not successful")
	}

	if v != nil {
		err := json.NewDecoder(resp.Body).Decode(v)
		if err != nil {
			return resp, err
		}
	}
	return resp, err
}
