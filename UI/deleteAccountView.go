package UI

import (
	"github.com/jeyldii/discordik/messages"
	"github.com/jeyldii/discordik/services/discordUserProvider"
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
