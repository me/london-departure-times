package main

type Client interface {
	Stops() StopsService
	Arrivals() ArrivalsService
}
