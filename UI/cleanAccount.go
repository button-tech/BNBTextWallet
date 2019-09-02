package UI

import (
	"github.com/jeyldii/discordik/messages"
	"github.com/jeyldii/discordik/services/redisService"
)

func (ctx *Pages) CleanAccountView() {
	if err := redisService.DeleteProperties(ctx.Identifier()); err != nil {
		ctx.SendMessage(messages.MsgInternalError)
		return
	}
	ctx.SendMessage(messages.CleanAccount)
	ctx.HelpView()
}
