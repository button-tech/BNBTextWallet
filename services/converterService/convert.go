package converterService

import (
	"github.com/button-tech/BNBTextWallet/helpers"
	"github.com/button-tech/BNBTextWallet/services/courseService"
)

type SendData struct {
	Amount       float64
	AmountUSD    float64
	ToNickName   string
	IdentifierTo string
	ToAddress    string
}

// todo: amount to fixed загуглить сколько
func (sd *SendData) Convert(amount string) error {
	sumBalance, isToken, err := helpers.SumConverter(amount)
	if err != nil {
		return err
	}

	var course courseService.BnBCourse
	if err = course.GetBnBCourse(); err != nil {
		return err
	}

	if isToken {
		total := course.USD * sumBalance
		sd.AmountUSD = total
		sd.Amount = sumBalance
		return nil
	}

	total := sumBalance / course.USD
	sd.AmountUSD = sumBalance
	sd.Amount = total

	return nil
}
