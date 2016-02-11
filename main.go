package main

import _ "github.com/joho/godotenv/autoload"
import "github.com/gin-gonic/gin"
import "net/http"

func main() {
    r := gin.Default()

    r.LoadHTMLGlob("templates/*")

    r.GET("/", func(c *gin.Context) {
        c.HTML(http.StatusOK, "index.tmpl", gin.H{
            "title": "Hello",
        })
    })

    r.GET("/ping", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "message": "pong",
        })
    })
    r.Run()
}
