package balanceService

import (
	"fmt"
	"github.com/imroc/req"
	"strconv"
)

type Balances struct {
	Bnb float64
}

type BnBBalance struct {
	AccountNumber int    `json:"account_number"`
	Address       string `json:"address"`
	Balances      []struct {
		Free   string `json:"free,omitempty"`
		Frozen string `json:"frozen,omitempty"`
		Locked string `json:"locked,omitempty"`
		Symbol string `json:"symbol,omitempty"`
	} `json:"balances"`
	Flags     int   `json:"flags"`
	PublicKey []int `json:"public_key"`
	Sequence  int   `json:"sequence"`
}

//bnb1jxfh2g85q3v0tdq56fnevx6xcxtcnhtsmcu64m
func (b *Balances) GetBalances(address string) error {
	r := req.New()
	url := fmt.Sprintf("https://dex.binance.org/api/v1/account/%s", address)

	resp, err := r.Get(url)
	if err != nil {
		fmt.Println(err)
		return err
	}
	s, err := resp.ToString()
	if s == "" {
		b.Bnb = 0.0
		return nil
	}

	var balances BnBBalance
	if err = resp.ToJSON(&balances); err != nil {
		return err
	}

	var balance string
	for _, item := range balances.Balances {
		if item.Symbol == "BNB" {
			balance = item.Free
			break
		}
	}

	flBalance, err := strconv.ParseFloat(balance, 64)
	if err != nil {
		return err
	}

	b.Bnb = flBalance
	return nil
}
