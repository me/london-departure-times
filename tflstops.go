package main

import (
	"fmt"
)

// Stops API call implementation
type TFLStopsServiceOp struct {
	client *TFLClient
}

// GET /StopPoint response
type TFLStopPointsResponse struct {
	StopPoints []TFLStopPoint `json:"stopPoints"`
}

// GET /StopPoint embedded StopPoint
type TFLStopPoint struct {
	Id        string          `json:"id"`
	Indicator string          `json:"indicator"`
	Name      string          `json:"commonName"`
	Lines     []TFLIdentifier `json:"lines"`
}

// TFL line identifier
type TFLIdentifier struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

// GET /StopPoint
func (api *TFLStopsServiceOp) Get(lat float32, lon float32, radius uint) ([]Stop, error) {
	u := api.client.BaseURL
	u.Path = "/StopPoint"
	query := u.Query()
	query.Set("lat", fmt.Sprintf("%.2f", lat))
	query.Set("lon", fmt.Sprintf("%.2f", lon))
	query.Set("radius", fmt.Sprintf("%d", radius))

	stopPointsResponse := new(TFLStopPointsResponse)
	_, err := api.client.Request(*u, stopPointsResponse)
	if err != nil {
		return nil, err
	}

	stops := make([]Stop, len(stopPointsResponse.StopPoints))
	for i, tflStopPoint := range stopPointsResponse.StopPoints {
		lines := make([]Line, len(tflStopPoint.Lines))
		for j, tflLine := range tflStopPoint.Lines {
			lines[j] = Line{tflLine.Id, tflLine.Name}
		}
		stops[i] = Stop{tflStopPoint.Id, tflStopPoint.Indicator, tflStopPoint.Name, lines}
	}
	return stops, nil
}
