package redisRepository

import (
	"time"

	"github.com/go-redis/redis"
)

type RedisRepository struct {
	db *redis.Client
}

func tryConnect(addr, password string) (*RedisRepository, error) {
	client := redis.NewClient(&redis.Options{
		Addr:         addr,
		Password:     password,
		DialTimeout:  10 * time.Second,
		ReadTimeout:  30 * time.Second,
		WriteTimeout: 30 * time.Second,
		PoolSize:     10,
		PoolTimeout:  30 * time.Second,
	})

	_, err := client.Ping().Result()
	return &RedisRepository{
		db: client,
	}, err
}

func (r *RedisRepository) Close() {
	r.db.Close()
}

func (r *RedisRepository) Set(key string, value interface{}, duration time.Duration) error {
	return r.db.Set(key, value, duration).Err()
}

func (r *RedisRepository) Get(key string) (string, error) {
	return r.db.Get(key).Result()
}

func (r *RedisRepository) Delete(key string) error {
	return r.db.Del(key).Err()
}
