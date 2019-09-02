package UI

import (
	"github.com/button-tech/BNBTextWallet/messages"
	"github.com/button-tech/BNBTextWallet/services/discordUserProvider"
)

func (ctx *Pages) AddressView() {
	user, err := discordUserProvider.GetUser(ctx.Identifier())
	if err != nil || user.BnbAddress == "" {
		ctx.SendMessage(messages.MsgForCreate)
		return
	}

	ctx.SendMessage(messages.BuildCodeMarkdown(user.BnbAddress))
}
