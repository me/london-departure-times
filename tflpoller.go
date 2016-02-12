package main

import (
	"log"
	"time"
)

const (
	numPollers     = 2                // number of Poller goroutines to launch
	pollInterval   = 10 * time.Second // how often to poll each stop
	expireInterval = 30 * time.Second // for how long to keep polling
)

// PollState represents the current state of a Stop being polled.
type PollState struct {
	StopId   string
	Arrivals []Arrival
	Expires  time.Time
}

type PollResult struct {
	StopId   string
	Arrivals []Arrival
}

type Poller struct {
	requests   chan<- *PollResource
	stopStates map[string]*PollState
}

func (p *Poller) Request(client *TFLClient, stopId string) []Arrival {
	request := PollResource{client: client, stopId: stopId}
	if p.stopStates[stopId] != nil {
		p.stopStates[stopId].Expires = time.Now().Add(expireInterval)
		return p.stopStates[stopId].Arrivals
	} else {
		p.requests <- &request
		return nil
	}
}

// PollResource represents a stopId to be polled.
type PollResource struct {
	client *TFLClient
	stopId string
}

// Poll executes an Arrivals.Get request
// and returns the Arrivals array.
func (r *PollResource) Poll() []Arrival {
	resp, err := r.client.Arrivals.Get(r.stopId)
	if err != nil {
		log.Println("Error", r.stopId, err)
	}
	return resp
}

// Sleep sleeps for an appropriate interval
// before sending the PollResource to requeue.
func (r *PollResource) Sleep(requeue chan<- *PollResource, status *PollState) {
	time.Sleep(pollInterval)
	if status == nil || status.Expires.After(time.Now()) {
		requeue <- r
	}
}

func PollerAction(in <-chan *PollResource, out chan<- *PollResource, status chan<- PollResult) {
	for r := range in {
		s := r.Poll()
		status <- PollResult{r.stopId, s}
		out <- r
	}
}

func NewPoller() *Poller {
	// Create our input and output channels.
	pending, complete := make(chan *PollResource), make(chan *PollResource)

	pollResults := make(chan PollResult)
	stopStates := make(map[string]*PollState)
	go func() {
		for {
			select {
			case r := <-pollResults:
				if stopStates[r.StopId] != nil {
					stopStates[r.StopId] = &PollState{r.StopId, r.Arrivals, stopStates[r.StopId].Expires}
				} else {
					stopStates[r.StopId] = &PollState{r.StopId, r.Arrivals, time.Now().Add(expireInterval)}
				}

			}
		}
	}()

	// Launch some Poller goroutines.
	for i := 0; i < numPollers; i++ {
		go PollerAction(pending, complete, pollResults)
	}

	go func() {
		for r := range complete {
			go r.Sleep(pending, stopStates[r.stopId])
		}
	}()

	poller := Poller{requests: pending, stopStates: stopStates}

	return &poller
}
