package UI

import (
	"github.com/button-tech/BNBTextWallet/data"
	"github.com/button-tech/BNBTextWallet/errors"
	"github.com/button-tech/BNBTextWallet/helpers"
	"github.com/button-tech/BNBTextWallet/messages"
	"github.com/button-tech/BNBTextWallet/services/converterService"
	"github.com/button-tech/BNBTextWallet/services/discordUserProvider"
	"github.com/button-tech/BNBTextWallet/services/guidService"
	"regexp"
	"strings"
)

func (ctx *Pages) SendView() {
	user, err := discordUserProvider.GetUser(ctx.Identifier())
	if err != nil || user.BnbAddress == "" {
		ctx.SendMessage(messages.MsgForCreate)
		return
	}

	sData, err := validMessageHelper(ctx.Content())
	switch err {
	case typedErrors.InvalidSendMessage:
		ctx.SendMessage(messages.SendHelp)
		return
	case typedErrors.UserNotFound:
		ctx.SendMessage(messages.UserNotFound)
		return
	case nil:
	default:
		ctx.SendMessage(messages.MsgInternalError)
		return
	}

	transactionData := data.TransactionData{
		IdentifierFrom: ctx.Identifier(),
		IdentifierTo:   sData.IdentifierTo,
		NicknameFrom:   ctx.Nickname(),
		AddressFrom:    user.BnbAddress,
		AddressTo:      sData.ToAddress,
		NicknameTo:     sData.ToNickName,
		Amount:         sData.Amount,
		AmountUSD:      sData.AmountUSD,
		Currency:       "BnB",
	}

	gc := data.DiscordGuidStamp{
		Identifier:      ctx.Identifier(),
		Nickname:        ctx.Nickname(),
		TransactionData: &transactionData,
	}

	strGuid, err := guidService.Generate(gc)
	if err != nil {
		ctx.SendMessage(messages.MsgInternalError)
		return
	}

	ctx.SendMessage(messages.BuildUrl("/send/?send="+strGuid))
}

func validMessageHelper(c string) (*converterService.SendData, error) {
	contentForSend := []byte(c)
	patternForSend := `^/send\s+([+-]?([0-9]*[.])?[0-9]+)\$*\s+\w+\s*$`

	matched, err := regexp.Match(patternForSend, contentForSend)
	if err != nil {
		return nil, typedErrors.InvalidSendMessage
	}

	if !matched {
		return nil, typedErrors.InvalidSendMessage
	}

	content := strings.Split(c, " ")

	var sData converterService.SendData
	if err = sData.Convert(content[1]); err != nil {
		return nil, err
	}

	destination, isNickname := helpers.NickConvert(content[2])
	if !isNickname {
		sData.ToAddress = destination
		return &sData, nil
	}

	sData.ToNickName = destination
	userTo, err := discordUserProvider.GetUserByNickName(destination)
	if err != nil || userTo.BnbAddress == "" {
		return nil, typedErrors.UserNotFound
	}

	sData.IdentifierTo = userTo.Identifier
	sData.ToAddress = userTo.BnbAddress

	return &sData, nil
}
