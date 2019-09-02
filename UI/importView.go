package UI

import (
	"github.com/button-tech/BNBTextWallet/data"
	"github.com/button-tech/BNBTextWallet/messages"
	"github.com/button-tech/BNBTextWallet/services/discordUserProvider"
	"github.com/button-tech/BNBTextWallet/services/guidService"
)

func (ctx *Pages) ImportView() {
	if user, err := discordUserProvider.GetUser(ctx.Identifier()); err == nil && user.BnbAddress != "" {
		ctx.SendMessage("First, you need to delete your account")
		return
	}

	strGuid, err := guidService.Generate(data.DiscordGuidStamp{
		Identifier: ctx.Identifier(),
		ChannelId:  ctx.ChannelId(),
		Nickname:   ctx.Nickname(),
	})
	if err != nil {
		ctx.SendMessage(messages.MsgInternalError)
		return
	}

	ctx.SendMessage(messages.BuildUrl("/import/?import=" + strGuid))
}
