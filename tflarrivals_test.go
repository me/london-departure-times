package main

import (
	"fmt"
	"net/http"
	"reflect"
	"testing"
	"time"
)

func TestTFLArrivals_Get(t *testing.T) {
	setupTFL()
	defer teardownTFL()

	mux.HandleFunc("/StopPoint/123W/Arrivals", func(w http.ResponseWriter, r *http.Request) {

		fmt.Fprint(w, `[
      {
        "$type": "Tfl.Api.Presentation.Entities.Prediction, Tfl.Api.Presentation.Entities",
        "id": "-2076968907",
        "operationType": 1,
        "vehicleId": "LJ09OKL",
        "naptanId": "490015372W",
        "stationName": "Marcilly Road",
        "lineId": "156",
        "lineName": "156",
        "platformName": "SB",
        "direction": "inbound",
        "destinationNaptanId": "",
        "destinationName": "Wimbledon",
        "timestamp": "2016-02-11T11:54:06.966Z",
        "timeToStation": 1515,
        "currentLocation": "",
        "towards": "Wandsworth",
        "expectedArrival": "2016-02-11T12:19:22Z",
        "timeToLive": "2016-02-11T12:19:52Z",
        "modeName": "bus"
        },
        {
        "$type": "Tfl.Api.Presentation.Entities.Prediction, Tfl.Api.Presentation.Entities",
        "id": "932760048",
        "operationType": 1,
        "vehicleId": "LJ09OLE",
        "naptanId": "490015372W",
        "stationName": "Marcilly Road",
        "lineId": "156",
        "lineName": "156",
        "platformName": "SB",
        "direction": "inbound",
        "destinationNaptanId": "",
        "destinationName": "Richmond",
        "timestamp": "2016-02-11T11:54:16.876Z",
        "timeToStation": 204,
        "currentLocation": "",
        "towards": "Wandsworth",
        "expectedArrival": "2016-02-11T11:57:41Z",
        "timeToLive": "2016-02-11T11:58:11Z",
        "modeName": "bus"
        }
    ]`)
	})

	arrivals, err := client.Arrivals.Get("123W")
	if err != nil {
		t.Errorf("Arrivals().Get returned error: %v", err)
	}
	v1 := Vehicle{Id: "LJ09OKL", Type: "bus", Destination: "Wimbledon"}
	t1, _ := time.Parse(time.RFC3339, "2016-02-11T12:19:22Z")
	v2 := Vehicle{Id: "LJ09OLE", Type: "bus", Destination: "Richmond"}
	t2, _ := time.Parse(time.RFC3339, "2016-02-11T11:57:41Z")
	expected := []Arrival{{Vehicle: v1, Expected: t1}, {Vehicle: v2, Expected: t2}}
	if !reflect.DeepEqual(arrivals, expected) {
		t.Errorf("Arrivals().Get returned %+v, expected %+v", arrivals, expected)
	}
}
