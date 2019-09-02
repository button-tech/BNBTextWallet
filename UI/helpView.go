package UI

import (
	"github.com/button-tech/BNBTextWallet/messages"
)

func (ctx *Pages) HelpView() {
	hello := messages.Welcome(ctx.Nickname())
	ctx.SendMessage(hello)
}
