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
	r := gin.Default()

	r.Static("/assets", "./assets")
	r.LoadHTMLGlob("templates/*")

	r.GET("/", func(c *gin.Context) {
		lat := c.Query("lat")
		lon := c.Query("lon")
		c.HTML(http.StatusOK, "index.tmpl", gin.H{"lat": lat, "lon": lon})
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
			c.JSON(http.StatusBadRequest, gin.H{})
			return
		}
		client := NewTFLClient(nil, os.Getenv("TFL_APP_ID"), os.Getenv("TFL_APP_KEY"))
		stops, err := client.Stops.Get(lat, lon, 200)

		if err != nil {
			log.Printf("Error getting stops from API: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{})
			return
		}
		c.JSON(http.StatusOK, stops)

	})
	r.Run()
}
