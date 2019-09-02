package UI

import (
	"github.com/button-tech/BNBTextWallet/messages"
	"github.com/button-tech/BNBTextWallet/services/redisService"
)

func (ctx *Pages) CleanAccountView() {
	if err := redisService.DeleteProperties(ctx.Identifier()); err != nil {
		ctx.SendMessage(messages.MsgInternalError)
		return
	}
	ctx.SendMessage(messages.CleanAccount)
	ctx.HelpView()
}
