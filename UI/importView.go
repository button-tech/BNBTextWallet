package UI

import (
	"github.com/jeyldii/discordik/data"
	"github.com/jeyldii/discordik/messages"
	"github.com/jeyldii/discordik/services/discordUserProvider"
	"github.com/jeyldii/discordik/services/guidService"
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

	ctx.SendMessage(messages.BuildUrl("/import/?import="+strGuid))
}
