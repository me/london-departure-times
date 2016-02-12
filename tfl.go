package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"sort"
)

const (
	tflDefaultBaseURL = "https://api.tfl.gov.uk/"
	tflMediaType      = "application/json"
)

var (
	tflStopTypes = []string{"NaptanPublicBusCoachTram", "NaptanMetroStation",
		"NaptanMetroPlatform", "NaptanOnstreetBusCoachStopCluster",
		"NaptanOnstreetBusCoachStopPair", "TransportInterchange"}
)

type TFLClient struct {
	// HTTP client used to communicate with the API.
	client *http.Client

	// Base URL for API requests.
	BaseURL *url.URL

	appId  string
	appKey string

	Stops    StopsService
	Arrivals ArrivalsService
}

// NewClient returns a new TFL API client.
func NewTFLClient(httpClient *http.Client, appId string, appKey string) *TFLClient {
	sort.Strings(tflStopTypes)

	if httpClient == nil {
		httpClient = http.DefaultClient
	}

	baseURL, _ := url.Parse(tflDefaultBaseURL)

	c := &TFLClient{client: httpClient, BaseURL: baseURL, appId: appId, appKey: appKey}

	c.Stops = &TFLStopsServiceOp{client: c}
	c.Arrivals = &TFLArrivalsServiceOp{client: c}

	return c
}

func (client *TFLClient) Request(url url.URL, v interface{}) (*http.Response, error) {
	query := url.Query()
	query.Set("app_id", client.appId)
	query.Set("app_key", client.appKey)
	url.RawQuery = query.Encode()

	resp, err := client.client.Get(url.String())

	defer func() {
		if rerr := resp.Body.Close(); err == nil {
			err = rerr
		}
	}()

	if err != nil {
		return resp, err
	}
	if resp != nil && resp.StatusCode != 200 {
		return resp, errors.New(fmt.Sprintf("Request returned %v", resp.StatusCode))
	}

	if v != nil {
		err := json.NewDecoder(resp.Body).Decode(v)
		if err != nil {
			return resp, err
		}
	}
	return resp, err
}
