package UI

import (
	"github.com/jeyldii/discordik/messages"
)

func (ctx *Pages) HelpView() {
	hello := messages.Welcome(ctx.Nickname())
	ctx.SendMessage(hello)
}
