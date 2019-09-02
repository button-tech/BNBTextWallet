package models

type User struct {
	Username   string `json:"Username,omitempty" db:"Username"`
	BnbAddress string `json:"BinanceAddress,omitempty" db:"BnbAddress"`
	Identifier string `json:"Identifier,omitempty" db:"Identifier"`
}

type TransactionData struct {

	IdentifierFrom string  `json:"identifierFrom"`
	NicknameFrom   string  `json:"nicknameFrom"`
	IdentifierTo   string  `json:"identifierTo,omitempty"`
	NicknameTo     string  `json:"nicknameTo,omitempty"`
	AddressFrom    string  `json:"addressFrom"`
	AddressTo      string  `json:"addressTo"`
	Amount         float64 `json:"amount"`
	AmountUSD      float64 `json:"amountUsd"`
	Currency       string  `json:"currency"`
}