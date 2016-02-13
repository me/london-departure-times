package main

import (
	"log"
	"sync"
	"time"
)

const (
	numPollers     = 2                // number of Poller goroutines to launch
	pollInterval   = 10 * time.Second // how often to poll each stop
	expireInterval = 30 * time.Second // for how long to keep polling
)

// PollState represents the current state of a Stop being polled.
type PollState struct {
	Arrivals []Arrival
	Expires  time.Time
}

type PollResult struct {
	StopId   string
	Arrivals []Arrival
}

type Poller struct {
	requests    chan<- *PollResource
	stopStates  map[string]*PollState
	statesMutex *sync.RWMutex
}

func (p *Poller) Request(client *TFLClient, stopId string) []Arrival {
	request := PollResource{client: client, stopId: stopId}

	var arrivals []Arrival
	p.statesMutex.RLock()
	state := p.stopStates[stopId]
	if state == nil {
		arrivals = nil
	} else {
		arrivals = state.Arrivals
	}
	p.statesMutex.RUnlock()

	if state == nil {
		p.CreateState(stopId)
		p.requests <- &request
	} else {
		p.ExtendExpires(stopId)
	}
	return arrivals
}

func (p *Poller) CreateState(stopId string) {
	expiration := time.Now().Add(expireInterval)
	p.statesMutex.Lock()
	p.stopStates[stopId] = &PollState{make([]Arrival, 0), expiration}
	p.statesMutex.Unlock()
}

func (p *Poller) SetArrivals(stopId string, arrivals []Arrival) {
	p.statesMutex.Lock()
	p.stopStates[stopId].Arrivals = arrivals
	p.statesMutex.Unlock()
}

func (p *Poller) ExtendExpires(stopId string) {
	expiration := time.Now().Add(expireInterval)
	p.statesMutex.Lock()
	p.stopStates[stopId].Expires = expiration
	p.statesMutex.Unlock()
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
	poller := Poller{requests: pending, stopStates: stopStates, statesMutex: &sync.RWMutex{}}

	go func() {
		for {
			select {
			case r := <-pollResults:
				poller.SetArrivals(r.StopId, r.Arrivals)
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

	return &poller
}
