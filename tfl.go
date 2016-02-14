package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"sort"
	"time"
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

/**********************
* API entity structs
**********************/

type TFLArrival struct {
	Id              string    `json:"naptanId"`
	LineName        string    `json:"lineName"`
	VehicleId       string    `json:"vehicleId"`
	DestinationName string    `json:"destinationName"`
	ExpectedArrival time.Time `json:"expectedArrival"`
	ModeName        string    `json:"modeName"`
}

type TFLStopPoint struct {
	Id        string          `json:"id"`
	Indicator string          `json:"indicator"`
	Name      string          `json:"commonName"`
	Lat       float64         `json:"lat"`
	Lon       float64         `json:"lon"`
	StopType  string          `json:"stopType"`
	Lines     []TFLIdentifier `json:"lines"`
	Children  []TFLStopPoint  `json:"children"`
	LineGroup []TFLLineGroup  `json:"lineGroup"`
}

type TFLIdentifier struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

type TFLLineGroup struct {
	Id string `json:"naptanIdReference"`
}

/**********************
* Public interface
**********************/

// The TFL API client, containing pointers to the http client and
// the API endpoint services.
type TFLClient struct {
	// HTTP client used to communicate with the API.
	client *http.Client

	// Base URL for API requests.
	BaseURL *url.URL

	appId  string
	appKey string

	Stops     StopsService
	Arrivals  ArrivalsService
	StopPoint StopPointService
}

// Returns a new TFL API client, given the http client, appId and appKey
func NewTFLClient(httpClient *http.Client, appId string, appKey string) *TFLClient {
	sort.Strings(tflStopTypes)

	if httpClient == nil {
		httpClient = http.DefaultClient
	}

	baseURL, _ := url.Parse(tflDefaultBaseURL)

	c := &TFLClient{client: httpClient, BaseURL: baseURL, appId: appId, appKey: appKey}

	c.Stops = &TFLStopsServiceOp{client: c}
	c.Arrivals = &TFLArrivalsServiceOp{client: c}
	c.StopPoint = &TFLStopPointServiceOp{client: c}

	return c
}

/**********************
* Helper methods
**********************/

// Performs a request on the TFL API
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
