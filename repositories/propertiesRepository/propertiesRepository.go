package propertiesRepository

import (
	"github.com/jeyldii/discordik/data"
	"github.com/jeyldii/discordik/services/redisService"
	"time"
)

const propertiesLifetime = 24 * 30 * time.Hour

func Read(identifier string) (data.PropertiesStamp, error) {
	return redisService.ReadProperties(identifier)
}

func CreateOrUpdate(identifier string, propertiesDictionary map[string]interface{}) error {
	stamp := data.PropertiesStamp{
		Value: propertiesDictionary,
	}
	return redisService.CreateOrUpdateProperties(identifier, stamp, propertiesLifetime)
}

func Delete(identifier string) error {
	return redisService.DeleteProperties(identifier)
}
