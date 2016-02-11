package main

import (
	"fmt"
	"net/http"
	"reflect"
	"testing"
)

func TestTFLStops_Get(t *testing.T) {
	setupTFL()
	defer teardownTFL()

	mux.HandleFunc("/StopPoint", func(w http.ResponseWriter, r *http.Request) {

		fmt.Fprint(w, `{
      "$type": "Tfl.Api.Presentation.Entities.StopPointsResponse, Tfl.Api.Presentation.Entities",
      "centrePoint": [51.462,-0.18],
      "stopPoints": [
        {
        "$type": "Tfl.Api.Presentation.Entities.StopPoint, Tfl.Api.Presentation.Entities",
        "id": "490015372W", "commonName": "Marcilly Road",
        "naptanId": "490015372W", "indicator": "Stop SB", "stopLetter": "SB", "modes": ["bus"],
        "icsCode": "1009638", "stopType": "NaptanPublicBusCoachTram", "stationNaptan": "490015372W",
        "lines": [
          {
            "$type": "Tfl.Api.Presentation.Entities.Identifier, Tfl.Api.Presentation.Entities",
            "id": "156",
            "name": "156",
            "uri": "/Line/156",
            "type": "Line"
          },
          {
            "$type": "Tfl.Api.Presentation.Entities.Identifier, Tfl.Api.Presentation.Entities",
            "id": "170",
            "name": "170",
            "uri": "/Line/170",
            "type": "Line"
          }
        ]
        }
      ]
    }`)
	})

	stops, err := client.Stops.Get(51.462, -0.18, 100)
	if err != nil {
		t.Errorf("Stops().Get returned error: %v", err)
	}

	lines := []Line{{Id: "156", Name: "156"}, {Id: "170", Name: "170"}}
	expected := []Stop{{Id: "490015372W", Indicator: "Stop SB", Name: "Marcilly Road", Lines: lines}}
	if !reflect.DeepEqual(stops, expected) {
		t.Errorf("Stops().Get returned %+v, expected %+v", stops, expected)
	}
}
