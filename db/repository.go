package db

import (
	"github.com/button-tech/BNBTextWallet/data"
	"github.com/button-tech/BNBTextWallet/db/models"
	"log"
)

var rep Repository

type Repository interface {
	Close()
	CreateUser(user *models.User) error
	GetUser(identifier string) (*models.User, error)
	UpdateUser(updatedUser *models.User) error
	GetUserByNickname(nickname string) (*models.User, error)
	DeleteUser(identifier string) error
	InsertTransactionData(stamp *data.DiscordGuidStamp) error
}

func TryConnect(connectionString string) {
	db, err := newPostgres(connectionString)
	if err != nil {
		log.Fatal("failed to connect to database")
	}

	rep = db
}

func Close() {
	rep.Close()
}

func CreateUser(user *models.User) error {
	return rep.CreateUser(user)
}
func UpdateUser(updatedUser *models.User) error {
	return rep.UpdateUser(updatedUser)
}

func GetUser(identifier string) (*models.User, error) {
	return rep.GetUser(identifier)
}

func GetUserByNickname(nickname string) (*models.User, error) {
	return rep.GetUserByNickname(nickname)
}

func DeleteUser(identifier string) error {
	return rep.DeleteUser(identifier)
}

func InsertTransactionData(stamp *data.DiscordGuidStamp) error {
	return rep.InsertTransactionData(stamp)
}
