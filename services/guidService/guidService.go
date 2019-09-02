package guidService

import (
	"github.com/google/uuid"
	"github.com/button-tech/BNBTextWallet/data"
	"github.com/button-tech/BNBTextWallet/services/redisService"
	"time"
)

const guidLifetime = 100 * time.Minute

func Generate(data data.DiscordGuidStamp) (string, error) {
	guid := generateGuid()
	return guid, redisService.CreateOrUpdateGuid(guid, data, guidLifetime)
}

func Read(guid string) (data.DiscordGuidStamp, error) {
	return redisService.ReadGuid(guid)
}

func Delete(guid string) error {
	return redisService.DeleteGuid(guid)
}

func generateGuid() string {
	guid := uuid.New().String()
	return guid[:10]
}
