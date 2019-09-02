package UI

import (
	"fmt"
	"github.com/jeyldii/discordik/messages"
	"github.com/jeyldii/discordik/services/balanceUtils"
	"github.com/jeyldii/discordik/services/discordUserProvider"
)

func (ctx *Pages) BalanceView() {
	user, err := discordUserProvider.GetUser(ctx.Identifier())
	if err != nil || user.BnbAddress == "" {
		ctx.SendMessage(messages.MsgForCreate)
		return
	}

	var fData balanceUtils.FundsData
	if err := fData.GetBalanceAndCourse(user.BnbAddress); err != nil {
		msg := "Binance Coin (BNB)\n" + messages.BuildCodeMarkdown("-_-")
		ctx.SendMessage(msg)
		return
	}

	ctx.SendMessage(buildBalanceMessage(fData))
}

func buildBalanceMessage(fData balanceUtils.FundsData) string {
	messagePrefix := "Binance Coin (BNB)\n"

	total := fData.Balance.Bnb * fData.Course.USD

	if total >= 0.01 {
		return fmt.Sprintf(
			messagePrefix+messages.BuildCodeMarkdown("%.8f ≈ %.2f$"), fData.Balance.Bnb, total)
	}

	var sumInDollars string
	if total == 0.00 {
		sumInDollars = "0.00$"
	} else {
		sumInDollars = "< 0.01$"
	}

	return fmt.Sprintf(
		messagePrefix+messages.BuildCodeMarkdown("%.8f ≈ " + sumInDollars), fData.Balance.Bnb)
}
