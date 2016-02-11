package main

type StopsService interface {
	Get(lat float32, lon float32, radius uint) ([]Stop, error)
}

type Stop struct {
	Id        string `json:"id"`
	Indicator string `json:"indicator"`
	Name      string `json:"name"`
	Lines     []Line `json:"lines"`
}

type Line struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}
