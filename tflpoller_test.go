package main

import (
	"testing"
	"time"
)

func TestTFLPoller(t *testing.T) {
	pollerOptions := &PollerOptions{numPollers: 2, pollInterval: 10 * time.Millisecond,
		expireInterval: 25 * time.Millisecond}
	poller := NewPoller(pollerOptions)

	var fakeService = new(FakeArrivalsService)
	arrivals := make([]Arrival, 1)
	arrivals[0] = Arrival{Line: "testline"}
	fakeService.GetReturns(arrivals, nil)
	stopId := "123"
	result1 := poller.Request(fakeService, stopId)
	if result1 != nil {
		t.Error("Expected first result to be nil")
	}
	time.Sleep(15 * time.Millisecond)
	result2 := poller.Request(fakeService, stopId)
	if len(result2) != 1 {
		t.Error("Expected second result to be of length 1")
	}
	if result2[0].Line != "testline" {
		t.Error("Expected second result to contain the fake result")
	}
	time.Sleep(100 * time.Millisecond)
	cnt := fakeService.GetCallCount()
	if cnt != 4 {
		t.Errorf("Expected service to be called exactly 4 times, was called %v", cnt)
	}
	result3 := poller.Request(fakeService, stopId)
	if result3 != nil {
		t.Error("Expected result after expiration to be nil")
	}
}
