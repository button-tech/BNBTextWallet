package discordUserProvider

import (
	"encoding/json"
	"github.com/imdario/mergo"
	"github.com/button-tech/BNBTextWallet/db"
	"github.com/button-tech/BNBTextWallet/db/models"
	"github.com/button-tech/BNBTextWallet/repositories/propertiesRepository"
)

const userKey = "dbUser"

func GetUser(identifier string) (*models.User, error) {
	properties, err := propertiesRepository.Read(identifier)
	if err == nil {
		ui := properties.Value[userKey]
		mu, err := json.Marshal(ui)
		if err != nil {
			return nil, err
		}
		var user models.User
		if err = json.Unmarshal(mu, &user); err != nil {
			return nil, err
		}

		return &user, nil
	}
	user, err := db.GetUser(identifier)
	if err != nil {
		return nil, err
	}
	if err := syncUser(identifier, user); err != nil {
		return nil, err
	}
	return user, nil
}

func GetUserByNickName(nickname string) (*models.User, error) {
	return db.GetUserByNickname(nickname)
}

func CreateUser(user *models.User) error {
	err := db.CreateUser(user)
	if err != nil {
		return err
	}
	return syncUser(user.Identifier, user)
}

func UpdateUser(updatedUser *models.User) error {
	user, err := GetUser(updatedUser.Identifier)
	if err != nil {
		return err
	}

	if err := mergo.Merge(user, updatedUser); err != nil {
		return err
	}
	if err := db.UpdateUser(updatedUser); err != nil {
		return err
	}

	return syncUser(user.Identifier, user)
}

func DeleteUser(identifier string) error {
	if err := db.DeleteUser(identifier); err != nil {
		return err
	}

	if err := propertiesRepository.Delete(identifier); err != nil {
		return err
	}

	return nil
}

func syncUser(identifier string, user *models.User) error {
	newMap := make(map[string]interface{})
	newMap[userKey] = user
	return propertiesRepository.CreateOrUpdate(identifier, newMap)
}