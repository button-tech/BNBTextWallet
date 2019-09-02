package db

import (
	"github.com/button-tech/BNBTextWallet/data"
	"github.com/button-tech/BNBTextWallet/db/models"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"log"
)

type PostgresRepository struct {
	db *sqlx.DB
}

func newPostgres(url string) (*PostgresRepository, error) {
	db, err := sqlx.Open("postgres", url)
	if err != nil {
		return nil, err
	}
	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}

	return &PostgresRepository{
		db,
	}, nil
}

func (r *PostgresRepository) Close() {
	r.db.Close()
}

func (r *PostgresRepository) CreateUser(user *models.User) error {
	_, err := r.db.Exec(`INSERT INTO "Users" ("Username", "BnbAddress", "Identifier") VALUES($1, $2, $3);`,
		user.Username, user.BnbAddress, user.Identifier)
	return err
}

func (r *PostgresRepository) UpdateUser(updatedUser *models.User) error {
	_, err := r.db.Exec(`UPDATE "Users" set "Username"=$1, "BnbAddress"=$2, "Identifier"=$3 where "Identifier"=$4`,
		updatedUser.Username, updatedUser.BnbAddress, updatedUser.Identifier, updatedUser.Identifier)
	if err != nil {
		return err
	}

	return nil
}

func (r *PostgresRepository) GetUser(identifier string) (*models.User, error) {
	row := r.db.QueryRow(
		`SELECT "Username", "BnbAddress", "Identifier" from "Users" where "Identifier" = $1;`, identifier)

	var user models.User
	if err := row.Scan(&user.Username, &user.BnbAddress, &user.Identifier); err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *PostgresRepository) GetUserByNickname(nickname string) (*models.User, error) {
	row := r.db.QueryRow(
		`SELECT "Username", "BnbAddress", "Identifier" from "Users" where "Username" = $1;`, nickname)

	var user models.User
	if err := row.Scan(&user.Username, &user.BnbAddress, &user.Identifier); err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *PostgresRepository) DeleteUser(identifier string) error {
	if _, err := r.db.Exec(`UPDATE "Users" SET "BnbAddress"='' where "Identifier" = $1;`, identifier); err != nil {
		return err
	}

	return nil
}

func (r *PostgresRepository) InsertTransactionData(stamp *data.DiscordGuidStamp) error {
	if _, err := r.db.NamedExec(`INSERT INTO "Transactions" (
		"TxHash", "FromAddress", "ToAddress", "FromNick", "Currency", 
		"SumInCurrency", "SumInDollars", "FromIdentifier", "ToIdentifier", "ToNick") 
	 	VALUES (:TxHash, :FromAddress, :ToAddress, :FromNick, :Currency, :SumInCurrency, :SumInDollars, 
	 	:FromIdentifier, :ToIdentifier, :ToNick)`, stamp.TransactionData); err != nil {
		return err
	}

	return nil
}
