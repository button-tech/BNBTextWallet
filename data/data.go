package data

import "time"

type DiscordGuidStamp struct {
	Identifier       string           `json:"identifier"`
	Nickname         string           `json:"nickname"`
	Guid             string           `json:"guid"`
	ChannelId        string           `json:"channelId"`
	LifetimeToDelete time.Time        `json:"lifetime"`
	TransactionData  *TransactionData `json:"transactionData"`
}

type TransactionData struct {
	TxHash		   string  `json:"txHash" db:"TxHash"`
	IdentifierFrom string  `json:"identifierFrom" db:"FromIdentifier"`
	NicknameFrom   string  `json:"nicknameFrom" db:"FromNick"`
	IdentifierTo   string  `json:"identifierTo,omitempty" db:"ToIdentifier"`
	NicknameTo     string  `json:"nicknameTo,omitempty" db:"ToNick"`
	AddressFrom    string  `json:"addressFrom" db:"FromAddress"`
	AddressTo      string  `json:"addressTo" db:"ToAddress"`
	Amount         float64 `json:"amount" db:"SumInCurrency"`
	AmountUSD      float64 `json:"amountUsd" db:"SumInDollars"`
	Currency       string  `json:"currency" db:"Currency"`
}

type PropertiesStamp struct {
	Value map[string]interface{}
}
