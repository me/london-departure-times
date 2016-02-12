package main

import (
	"github.com/gin-gonic/gin"
	_ "github.com/joho/godotenv/autoload"
	"log"
	"net/http"
	"os"
	"strconv"
)

func main() {
	log.Println("hey there1")
	poller := NewPoller()
	log.Println("hey there")
	client := NewTFLClient(nil, os.Getenv("TFL_APP_ID"), os.Getenv("TFL_APP_KEY"))

	r := gin.Default()

	r.Static("/assets", "./assets")
	r.LoadHTMLGlob("templates/*")

	r.GET("/", func(c *gin.Context) {
		lat := c.Query("lat")
		lon := c.Query("lon")
		c.HTML(http.StatusOK, "index.tmpl", gin.H{"lat": lat, "lon": lon})
	})

	r.GET("/tfl/arrivals/:stopId", func(c *gin.Context) {

		_ = poller.Request(client, c.Param("stopId"))

		c.HTML(http.StatusOK, "arrivals.tmpl", gin.H{"provider": "tfl", "stopId": c.Param("stopId")})
	})

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
		arrivals := poller.Request(client, c.Param("stopId"))
		c.JSON(http.StatusOK, gin.H{"arrivals": arrivals})
	})
	r.Run()
}
