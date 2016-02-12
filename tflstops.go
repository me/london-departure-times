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
	Lat       float64         `json:"lat"`
	Lon       float64         `json:"lon"`
	Lines     []TFLIdentifier `json:"lines"`
}

// TFL line identifier
type TFLIdentifier struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

// GET /StopPoint
func (api *TFLStopsServiceOp) Get(lat float64, lon float64, radius uint) ([]Stop, error) {
	u := api.client.BaseURL
	u.Path = "/StopPoint"
	query := u.Query()
	query.Set("lat", fmt.Sprintf("%.2f", lat))
	query.Set("lon", fmt.Sprintf("%.2f", lon))
	query.Set("radius", fmt.Sprintf("%d", radius))
	query.Set("stopTypes", tflStopTypes)
	u.RawQuery = query.Encode()

	stopPointsResponse := new(TFLStopPointsResponse)
	_, err := api.client.Request(*u, stopPointsResponse)
	if err != nil {
		return nil, err
	}

	stops := make([]Stop, 0)
	for _, tflStopPoint := range stopPointsResponse.StopPoints {
		if len(tflStopPoint.Lines) == 0 {
			continue
		}
		lines := make([]Line, len(tflStopPoint.Lines))
		for j, tflLine := range tflStopPoint.Lines {
			lines[j] = Line{tflLine.Id, tflLine.Name}
		}
		stops = append(stops, Stop{tflStopPoint.Id, "tfl", tflStopPoint.Indicator, tflStopPoint.Name,
			tflStopPoint.Lat, tflStopPoint.Lon, lines})
	}
	return stops, nil
}
