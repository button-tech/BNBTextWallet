package main

import (
	"github.com/bwmarrin/discordgo"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jeyldii/discordik/config"
	"github.com/jeyldii/discordik/db"
	"github.com/jeyldii/discordik/handlers"
	"github.com/jeyldii/discordik/repositories/redisRepository"
	"github.com/jeyldii/discordik/services/discordClient"
	"log"
)

func init() {
	err := config.EnvConfig.GetEnvs()
	if err != nil {
		log.Fatal()
	}

	redisRepository.TryConnect(config.EnvConfig.RedisHost, config.EnvConfig.RedisPassword)
	db.TryConnect(config.EnvConfig.Postgres)
}

func main() {
	defer redisRepository.Close()
	defer db.Close()

	go CreateBotSession(config.EnvConfig.BotToken)

	router := CreateServer()
	if err := router.Run(":5000"); err != nil {
		log.Fatal(err)
	}
}

func CreateServer() *gin.Engine {
	router := gin.Default()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	router.Use(cors.Default())
	api := router.Group("/api/discord")
	{
		api.PUT("/create/:guid", handlers.CreateWallet)
		api.GET("/transaction/:guid", handlers.Transaction)
		api.POST("/transaction/:guid", handlers.InsertTransactionHash)
	}

	return router
}

func CreateBotSession(token string) {
	s, err := discordgo.New("Bot " + token)
	if err != nil {
		log.Fatal(err)
	}

	handlers.InitBotHandlers(s)

	if err = s.Open(); err != nil {
		log.Fatal(err)
	}

	defer discordClient.Client.Close()

	discordClient.Client = &discordClient.DiscordClient{Session: s}
	<-make(chan struct{})
}
