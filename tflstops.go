package main

import (
	"fmt"
	"strings"
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
	StopType  string          `json:"stopType"`
	Lines     []TFLIdentifier `json:"lines"`
	Children  []TFLStopPoint  `json:"children"`
	LineGroup []TFLLineGroup  `json:"lineGroup"`
}

// TFL line identifier
type TFLIdentifier struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

type TFLLineGroup struct {
	Id string `json:"naptanIdReference"`
}

// GET /StopPoint
func (api *TFLStopsServiceOp) Get(lat float64, lon float64, radius uint) ([]Stop, error) {
	u := api.client.BaseURL
	u.Path = "/StopPoint"
	query := u.Query()
	query.Set("lat", fmt.Sprintf("%.4f", lat))
	query.Set("lon", fmt.Sprintf("%.4f", lon))
	query.Set("radius", fmt.Sprintf("%d", radius))
	query.Set("stopTypes", strings.Join(tflStopTypes, ","))
	query.Set("useStopPointHierarchy", "false")
	u.RawQuery = query.Encode()
	fmt.Println(u.String())

	stopPointsResponse := new(TFLStopPointsResponse)
	_, err := api.client.Request(*u, stopPointsResponse)
	if err != nil {
		return nil, err
	}

	stops := make([]Stop, 0)
	for _, tflStopPoint := range stopPointsResponse.StopPoints {
		stops = append(stops, api.ParseStop(&tflStopPoint)...)
	}
	return stops, nil
}

func (api *TFLStopsServiceOp) ParseStop(stop *TFLStopPoint) []Stop {
	stops := make([]Stop, 0)
	if len(stop.Lines) > 0 && len(stop.LineGroup) == 1 && stop.LineGroup[0].Id == stop.Id {
		lines := make([]Line, len(stop.Lines))
		for j, tflLine := range stop.Lines {
			lines[j] = Line{tflLine.Id, tflLine.Name}
		}
		indicator := stop.Indicator

		stops = append(stops, Stop{stop.Id, "tfl", indicator, stop.Name,
			stop.Lat, stop.Lon, lines})
	}
	return stops
}
