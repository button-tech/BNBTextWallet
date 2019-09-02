package UI

import (
	"github.com/button-tech/BNBTextWallet/data"
	"github.com/button-tech/BNBTextWallet/db/models"
	"github.com/button-tech/BNBTextWallet/messages"
	"github.com/button-tech/BNBTextWallet/services/discordUserProvider"
	"github.com/button-tech/BNBTextWallet/services/guidService"
)

func (ctx *Pages) CreateView() {
	user, userErr := discordUserProvider.GetUser(ctx.Identifier())
	if userErr == nil && user.BnbAddress != "" {
		ctx.SendMessage(messages.MsgIfCreate)
		return
	}

	strGuid, err := guidService.Generate(data.DiscordGuidStamp{
		Identifier: ctx.Identifier(),
		Nickname:   ctx.Nickname(),
		ChannelId:  ctx.ChannelId(),
	})
	if err != nil {
		ctx.SendMessage(messages.MsgInternalError)
		return
	}

	if userErr == nil && user.BnbAddress == "" {
		ctx.SendMessage(messages.MsgForFollowLink + messages.BuildUrl("/create/?create="+strGuid))
		return
	}

	userModel := models.User{
		Username:   ctx.Nickname(),
		BnbAddress: "",
		Identifier: ctx.Identifier(),
	}

	if err := discordUserProvider.CreateUser(&userModel); err != nil {
		ctx.SendMessage(messages.MsgInternalError)
		return
	}

	ctx.SendMessage(messages.MsgForFollowLink + messages.BuildUrl("/create/?create="+strGuid))
}
