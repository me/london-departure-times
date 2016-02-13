package main

import (
	"log"
	"sync"
	"time"
)

const (
	defaultNumPollers     = 2                // number of Poller goroutines to launch
	defaultPollInterval   = 10 * time.Second // how often to poll each stop
	defaultExpireInterval = 30 * time.Second // for how long to keep polling
)

// The current state of a Stop being polled.
type PollState struct {
	Arrivals []Arrival
	Expires  time.Time
}

// Holder for the results received from the API
type PollResult struct {
	StopId   string
	Arrivals []Arrival
}

// The main structure returned by NewPoller()
type Poller struct {
	requests    chan<- *PollResource
	stopStates  map[string]*PollState
	statesMutex *sync.RWMutex
	options     *PollerOptions
}

// Poller methods

// Request arrivals for a stop.
// Adds the request to the queue, if not already present, and returns
// the current known arrivals (if any).
func (p *Poller) Request(service ArrivalsService, stopId string) []Arrival {
	request := PollResource{service: service, stopId: stopId}

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

// Creates a new empty PollState in the state map.
func (p *Poller) CreateState(stopId string) {
	expiration := time.Now().Add(p.options.expireInterval)
	p.statesMutex.Lock()
	p.stopStates[stopId] = &PollState{make([]Arrival, 0), expiration}
	p.statesMutex.Unlock()
}

// Replaces the arrivals for the stop in the state map.
func (p *Poller) SetArrivals(stopId string, arrivals []Arrival) {
	p.statesMutex.Lock()
	p.stopStates[stopId].Arrivals = arrivals
	p.statesMutex.Unlock()
}

// Extends the expiration time of the PollState by expireInterval.
func (p *Poller) ExtendExpires(stopId string) {
	expiration := time.Now().Add(p.options.expireInterval)
	p.statesMutex.Lock()
	p.stopStates[stopId].Expires = expiration
	p.statesMutex.Unlock()
}

// Represents a stopId to be polled.
type PollResource struct {
	service ArrivalsService
	stopId  string
}

// Executes an Arrivals.Get request and returns the Arrivals array.
// Will be called by PollerAction when the PollResource is picked from the queue.
func (r *PollResource) Poll() []Arrival {
	resp, err := r.service.Get(r.stopId)
	if err != nil {
		log.Println("Error", r.stopId, err)
	}
	return resp
}

// Sleeps for an appropriate interval before sending the PollResource to requeue.
func (r *PollResource) Sleep(requeue chan<- *PollResource, status *PollState, pollInterval time.Duration) {
	time.Sleep(pollInterval)
	if status.Expires.After(time.Now()) {
		requeue <- r
	}
}

// Calls Poll() on the PollResource object picked from the in queue; sends
// results on the status queue, and forward the PollResource to the out queue.
func PollerAction(in <-chan *PollResource, out chan<- *PollResource, status chan<- PollResult) {
	for r := range in {
		s := r.Poll()
		status <- PollResult{r.stopId, s}
		out <- r
	}
}

type PollerOptions struct {
	numPollers     uint
	pollInterval   time.Duration
	expireInterval time.Duration
}

// Sets up and returns a new Poller
func NewPoller(options *PollerOptions) *Poller {
	// Set intervals
	if options == nil {
		options = &PollerOptions{defaultNumPollers, defaultPollInterval, defaultExpireInterval}
	}

	// Create input and output channels
	pending, complete := make(chan *PollResource), make(chan *PollResource)

	// Channel handling the received results
	pollResults := make(chan PollResult)
	// Map that holds the current state of stop arrivals
	stopStates := make(map[string]*PollState)
	// Create the Poller structure
	poller := Poller{requests: pending, stopStates: stopStates, statesMutex: &sync.RWMutex{}, options: options}

	// Update poller state when results are received
	go func() {
		for {
			select {
			case r := <-pollResults:
				poller.SetArrivals(r.StopId, r.Arrivals)
			}
		}
	}()

	// Launch the polling goroutines
	for i := uint(0); i < options.numPollers; i++ {
		go PollerAction(pending, complete, pollResults)
	}

	// Sleep tasks when they are complete
	go func() {
		for r := range complete {
			go r.Sleep(pending, stopStates[r.stopId], options.pollInterval)
		}
	}()

	return &poller
}
