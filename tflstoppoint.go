package main

import (
	"fmt"
)

// Stops API call implementation
type TFLStopPointServiceOp struct {
	client *TFLClient
}

// GET /StopPoint/[stopId]
func (api *TFLStopPointServiceOp) Get(stopId string) (*Stop, error) {
	u := api.client.BaseURL
	u.Path = fmt.Sprintf("/StopPoint/%s", stopId)
	query := u.Query()
	u.RawQuery = query.Encode()

	stopPoint := new(TFLStopPoint)
	_, err := api.client.Request(*u, stopPoint)
	if err != nil {
		return nil, err
	}

	return api.ParseStop(stopPoint, stopId), nil
}

func (api *TFLStopPointServiceOp) ParseStop(stop *TFLStopPoint, stopId string) *Stop {
	if stop.Id == stopId {
		return &Stop{Id: stop.Id, Provider: "tfl", Indicator: stop.Indicator, Name: stop.Name,
			Latitude: stop.Lat, Longitude: stop.Lon}
	} else {
		for _, child := range stop.Children {
			childStop := api.ParseStop(&child, stopId)
			if childStop != nil {
				return childStop
			}
		}
	}
	return nil
}
