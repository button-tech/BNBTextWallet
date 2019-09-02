package handlers

import (
	"github.com/bwmarrin/discordgo"
	"github.com/button-tech/BNBTextWallet/UI"
	"strings"
)

func MainBotHandler(s *discordgo.Session, m *discordgo.MessageCreate) {
	// Ignore all messages created by the bot itself
	if m.Author.ID == s.State.User.ID {
		return
	}
	ctx := UI.Pages{
		Update: m,
	}

	content := strings.ToLower(m.Content)

	if strings.Contains(content, "/help") {
		ctx.HelpView()
	} else if strings.Contains(content, "/create") {
		ctx.CreateView()
	} else if strings.Contains(content, "/address") {
		ctx.AddressView()
	} else if strings.Contains(content, "/balance") {
		ctx.BalanceView()
	} else if strings.Contains(content, "/import") {
		ctx.ImportView()
	} else if strings.Contains(content, "/clean") {
		ctx.CleanAccountView()
	} else if strings.Contains(content, "/send") {
		ctx.SendView()
	} else if strings.Contains(content, "/delete") {
		ctx.DeleteAccountView()
	}
}

//func ChangeStatus(s *discordgo.Session, ready *discordgo.Ready) {
//	discordClient.Client.UpdateStatus()
//}

func InitBotHandlers(s *discordgo.Session) {
	s.AddHandler(MainBotHandler)

	//s.AddHandler(ChangeStatus)
}
