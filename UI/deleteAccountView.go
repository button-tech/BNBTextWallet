package UI

import (
	"github.com/button-tech/BNBTextWallet/messages"
	"github.com/button-tech/BNBTextWallet/services/discordUserProvider"
)

func (ctx *Pages) DeleteAccountView() {
	user, err := discordUserProvider.GetUser(ctx.Identifier())
	if err != nil || user.BnbAddress == "" {
		ctx.SendMessage(messages.MsgForDeleteIfUserExist)
		return
	}

	if err = discordUserProvider.DeleteUser(ctx.Identifier()); err != nil {
		ctx.SendMessage(messages.MsgInternalError)
		return
	}

	ctx.SendMessage("Account deletion was successful")
}
