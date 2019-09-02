package main

import (
	"github.com/button-tech/BNBTextWallet/config"
	"github.com/button-tech/BNBTextWallet/db"
	"github.com/button-tech/BNBTextWallet/handlers"
	"github.com/button-tech/BNBTextWallet/repositories/redisRepository"
	"github.com/button-tech/BNBTextWallet/services/discordClient"
	"github.com/bwmarrin/discordgo"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
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
