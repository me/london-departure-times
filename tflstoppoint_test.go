package main

import (
	"fmt"
	"net/http"
	"reflect"
	"testing"
)

func TestTFLStopPoint_Get(t *testing.T) {
	setupTFL()
	defer teardownTFL()

	mux.HandleFunc("/StopPoint/490015372W", func(w http.ResponseWriter, r *http.Request) {

		fmt.Fprint(w, `{
      "$type": "Tfl.Api.Presentation.Entities.StopPoint, Tfl.Api.Presentation.Entities",
      "naptanId": "490G00009638",
      "modes": [
      "bus"
      ],
      "smsCode": "49625",
      "stopType": "NaptanOnstreetBusCoachStopCluster",
      "stationNaptan": "490G00009638",
      "lines": [],
      "lineGroup": [],
      "lineModeGroups": [],
      "status": true,
      "id": "490G00009638",
      "commonName": "Marcilly Road",
      "placeType": "StopPoint",
      "additionalProperties": [],
      "children": [
      {
      "$type": "Tfl.Api.Presentation.Entities.StopPoint, Tfl.Api.Presentation.Entities",
      "naptanId": "490015404E",
      "indicator": "Stop B",
      "stopLetter": "B",
      "modes": [
      "bus"
      ],
      "icsCode": "1009638",
      "stopType": "NaptanPublicBusCoachTram",
      "stationNaptan": "490015404E",
      "lines": [],
      "lineGroup": [],
      "lineModeGroups": [],
      "status": true,
      "id": "490015404E",
      "commonName": "Marcilly Road",
      "placeType": "StopPoint",
      "additionalProperties": [],
      "children": [],
      "lat": 51.459455,
      "lon": -0.180845
      },
      {
      "$type": "Tfl.Api.Presentation.Entities.StopPoint, Tfl.Api.Presentation.Entities",
      "naptanId": "490015372W",
      "indicator": "Stop SB",
      "stopLetter": "SB",
      "modes": [
      "bus"
      ],
      "icsCode": "1009638",
      "stopType": "NaptanPublicBusCoachTram",
      "stationNaptan": "490015372W",
      "lines": [],
      "lineGroup": [],
      "lineModeGroups": [],
      "status": true,
      "id": "490015372W",
      "commonName": "Marcilly Road",
      "placeType": "StopPoint",
      "additionalProperties": [],
      "children": [],
      "lat": 51.459726,
      "lon": -0.179222
      }
      ],
      "lat": 51.458376,
      "lon": -0.178556
      }
    }`)
	})

	stop, err := client.StopPoint.Get("490015372W")
	if err != nil {
		t.Errorf("StopPoint().Get returned error: %v", err)
	}

	expected := Stop{Id: "490015372W", Provider: "tfl", Indicator: "Stop SB", Name: "Marcilly Road",
		Latitude: 51.459726, Longitude: -0.179222}
	if !reflect.DeepEqual(*stop, expected) {
		t.Errorf("StopPoint().Get returned %+v, expected %+v", *stop, expected)
	}
}
