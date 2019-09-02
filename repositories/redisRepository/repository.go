package redisRepository

import (
	"log"
	"time"
)

var rep Repository

type Repository interface {
	Set(key string, value interface{}, duration time.Duration) error
	Get(key string) (string, error)
	Delete(key string) error
	Close()
}

func TryConnect(address, password string) {
	repository, err := tryConnect(address, password)
	if err != nil {
		log.Fatal("failed to connect to redis")
	}
	rep = repository
}

func Set(key string, value interface{}, duration time.Duration) error {
	return rep.Set(key, value, duration)
}

func Get(key string) (string, error) {
	return rep.Get(key)
}

func Delete(key string) error {
	return rep.Delete(key)
}

func Close() {
	rep.Close()
}
