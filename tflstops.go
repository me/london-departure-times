package main

import (
	"fmt"
	"strings"
)

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
	oneLine := len(stop.LineGroup) == 1 && stop.LineGroup[0].Id == stop.Id
	tube := stop.StopType == "NaptanMetroStation"
	if len(stop.Lines) > 0 && (oneLine || tube) {
		lines := make([]Line, len(stop.Lines))
		for j, tflLine := range stop.Lines {
			lines[j] = Line{tflLine.Id, tflLine.Name}
		}

		stops = append(stops, Stop{stop.Id, "tfl", stop.Indicator, stop.Name,
			stop.Lat, stop.Lon, lines})
	}
	return stops
}
