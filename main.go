package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	_ "github.com/joho/godotenv/autoload"
	"log"
	"net/http"
	"os"
	"strconv"
)

func main() {
	// Main performers
	poller := NewPoller(nil)
	client := NewTFLClient(nil, os.Getenv("TFL_APP_ID"), os.Getenv("TFL_APP_KEY"))

	// Serve pages
	ServeRequests(poller, client)
}

func ServeRequests(poller *Poller, client *TFLClient) {
	r := gin.Default()

	r.Static("/assets", "./assets")

	// HTML pages

	r.LoadHTMLGlob("templates/*")

	r.GET("/", func(c *gin.Context) {
		lat := c.Query("lat")
		lon := c.Query("lon")
		c.HTML(http.StatusOK, "index.tmpl", gin.H{"lat": lat, "lon": lon})
	})

	r.GET("/tfl/arrivals/:stopId", func(c *gin.Context) {
		stopId := c.Param("stopId")

		// The poller is called right away: it will error if the stop is not found,
		// but this gives more time to fetch the request before the page is loaded.
		_ = poller.Request(client.Arrivals, stopId)

		stop, err := client.StopPoint.Get(stopId)

		if err != nil || stop == nil {
			c.HTML(http.StatusNotFound, "notfound.tmpl", gin.H{})
			return
		}
		stopName := stop.Name
		if stop.Indicator != "" {
			stopName += fmt.Sprintf(" - %s", stop.Indicator)
		}

		c.HTML(http.StatusOK, "arrivals.tmpl", gin.H{"provider": "tfl", "stopId": c.Param("stopId"),
			"stopName": stopName})
	})

	// API

	api := r.Group("/api")

	api.GET("/stops", func(c *gin.Context) {
		lat, err := strconv.ParseFloat(c.Query("lat"), 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{})
			return
		}
		lon, err := strconv.ParseFloat(c.Query("lon"), 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		stops, err := client.Stops.Get(lat, lon, 300)

		if err != nil {
			log.Printf("Error getting stops from API: %v", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"stops": stops})
	})

	api.GET("/tfl/arrivals/:stopId", func(c *gin.Context) {
		arrivals := poller.Request(client.Arrivals, c.Param("stopId"))
		c.JSON(http.StatusOK, gin.H{"arrivals": arrivals})
	})

	r.Run()
}
