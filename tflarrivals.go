package main

import (
	"fmt"
	"log"
	"time"
)

// Arrivals API call implementation
type TFLArrivalsServiceOp struct {
	client *TFLClient
}

// TFL Arrival
type TFLArrival struct {
	Id              string    `json:"naptanId"`
	LineName        string    `json:"lineName"`
	VehicleId       string    `json:"vehicleId"`
	DestinationName string    `json:"destinationName"`
	ExpectedArrival time.Time `json:"expectedArrival"`
	ModeName        string    `json:"modeName"`
}

// GET /StopPoint/[stopId]/Arrivals
func (api *TFLArrivalsServiceOp) Get(stopId string) ([]Arrival, error) {
	u := api.client.BaseURL
	u.Path = fmt.Sprintf("/StopPoint/%s/Arrivals", stopId)
	log.Printf("Polling TFL arrivals for %s\n", stopId)

	tflArrivals := make([]TFLArrival, 0)
	_, err := api.client.Request(*u, &tflArrivals)
	if err != nil {
		return nil, err
	}

	arrivals := make([]Arrival, len(tflArrivals))
	for i, tflArrival := range tflArrivals {
		vehicle := Vehicle{tflArrival.VehicleId, tflArrival.ModeName, tflArrival.DestinationName}
		arrivals[i] = Arrival{Vehicle: vehicle, Line: tflArrival.LineName, Expected: tflArrival.ExpectedArrival}

	}
	return arrivals, nil
}
