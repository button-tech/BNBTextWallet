package UI

import (
	"github.com/jeyldii/discordik/messages"
	"github.com/jeyldii/discordik/services/discordUserProvider"
)

func (ctx *Pages) AddressView() {
	user, err := discordUserProvider.GetUser(ctx.Identifier())
	if err != nil || user.BnbAddress == "" {
		ctx.SendMessage(messages.MsgForCreate)
		return
	}

	ctx.SendMessage(messages.BuildCodeMarkdown(user.BnbAddress))
}
