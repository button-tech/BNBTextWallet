package redisService

import (
	"encoding/json"
	"github.com/imdario/mergo"
	"github.com/button-tech/BNBTextWallet/data"
	"github.com/button-tech/BNBTextWallet/repositories/redisRepository"
	"time"
)

var devKey = "release"

func discordGuidKey(guid string) string {
	return devKey + "discordGuidKey:" + guid
}

func discordPropertiesKey(identifier string) string {
	return devKey + "discordPropKey:" + identifier
}

func ReadGuid(guid string) (data.DiscordGuidStamp, error) {
	key := discordGuidKey(guid)
	value, err := redisRepository.Get(key)
	if err != nil {
		return data.DiscordGuidStamp{}, err
	}

	var stamp data.DiscordGuidStamp
	err = json.Unmarshal([]byte(value), &stamp)
	return stamp, err
}

func CreateOrUpdateGuid(guid string, newStamp data.DiscordGuidStamp, lifetime time.Duration) error {
	key := discordGuidKey(guid)
	stamp, err := ReadGuid(guid)
	if err == nil {
		if err := mergo.Merge(&stamp, newStamp); err != nil {
			return err
		}
	} else {
		stamp = newStamp
	}
	stamp.LifetimeToDelete = time.Now().Add(lifetime)
	stamp.Guid = guid
	value, err := json.Marshal(stamp)
	if err != nil {
		return err
	}
	return redisRepository.Set(key, value, lifetime)
}

func DeleteGuid(guid string) error {
	key := discordGuidKey(guid)
	return redisRepository.Delete(key)
}

func ReadProperties(identifier string) (data.PropertiesStamp, error) {
	key := discordPropertiesKey(identifier)
	value, err := redisRepository.Get(key)
	if err != nil {
		return data.PropertiesStamp{}, err
	}

	var stamp data.PropertiesStamp
	err = json.Unmarshal([]byte(value), &stamp)
	return stamp, err
}

func CreateOrUpdateProperties(identifier string, newStamp data.PropertiesStamp, lifetime time.Duration) error {
	key := discordPropertiesKey(identifier)
	stamp, err := ReadProperties(identifier)
	if err == nil {
		if stamp.Value == nil {
			stamp.Value = make(map[string]interface{})
		}
		for k, v := range newStamp.Value {
			stamp.Value[k] = v
		}
	} else {
		stamp = newStamp
	}
	value, err := json.Marshal(stamp)
	if err != nil {
		return err
	}
	return redisRepository.Set(key, value, lifetime)
}

func DeleteProperties(identifier string) error {
	key := discordPropertiesKey(identifier)
	return redisRepository.Delete(key)
}

func Close() {
	redisRepository.Close()
}
