package UI

import (
	. "github.com/button-tech/BNBTextWallet/services/discordClient"
	"github.com/bwmarrin/discordgo"
)

type Pages struct {
	Update *discordgo.MessageCreate
}

func (ctx *Pages) Content() string {
	return ctx.Update.Content
}

func (ctx *Pages) Identifier() string {
	return ctx.Update.Author.ID
}

func (ctx *Pages) ChannelId() string {
	return ctx.Update.ChannelID
}

func (ctx *Pages) Nickname() string {
	return ctx.Update.Author.Username
}

func (ctx *Pages) SendMessage(msg string) *discordgo.Message {
	return Client.SendMessage(ctx.ChannelId(), msg)
}

func (ctx *Pages) SendPrivateMessage(msg string) *discordgo.Message {
	return Client.SendPrivateMessage(ctx.Identifier(), msg)
}
