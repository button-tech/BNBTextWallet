package config

import (
	"github.com/caarlos0/env"
	"github.com/joho/godotenv"
	"log"
)

var EnvConfig Config

type Config struct {
	FrontendUrl   string `env:"FRONTEND_URL"`
	RedisHost     string `env:"REDIS_HOST"`
	RedisPassword string `env:"REDIS_PASSWORD"`
	BotToken      string `env:"BOT_TOKEN"`
	Postgres      string `env:"POSTGRES"`
}

func (c *Config) GetEnvs() error {
	if err := godotenv.Load(); err != nil {
		return c.parseEnv()
	}
	return c.parseEnv()
}

func (c *Config) parseEnv() error {
	err := env.Parse(c)
	if err != nil {
		log.Fatal(err)
		return err
	}
	return nil
}
