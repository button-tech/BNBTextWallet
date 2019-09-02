package messages

import (
	"fmt"
	"github.com/jeyldii/discordik/config"
)

var (
	MsgForDeleteIfUserExist = "You do not need to delete your account"
	MsgForCreate            = "You have't got account.\nYou can create it by typing command /create"
	MsgIfCreate             = "Account already created"
	MsgForFollowLink        = "Please, follow the link:\n"
	MsgInternalError        = "Please, try it latter"
	CleanAccount            = "Session cleared. All temporary data has been deleted."
)

var help = BuildCodeMarkdown(`Welcome to the BUTTON Wallet on Discord.️`+` You can create account or import QR/mnemonic and send BNB to your friends!
Just enter any of this commands.`) +
	BuildCodeMarkdown("Command  Parameters  Description:") + "\n️" +
	`	/create - Create a wallet

	/import - Import QR code/mnemonic

	/balance - Get your BNB address balance

	/send (amount, $ or ticker) (address or nickname) - Send BNB 

	/address - Get your BNB address`

var SendHelp = `Please, check your send information` + "\n" +
	`Information should be in the format:` + "\n" +
	BuildCodeMarkdown("Example: /send 100 @my_dear_friend or /send 100$ \"Address\"")

const UserNotFound = `The user to whom you want to send must be registered`

func Welcome(name string) string {
	hello := fmt.Sprintf("Hello, %s!", name+" ❤️")
	s := hello + help
	return s
}

func BuildUrl(path string) string {
	return config.EnvConfig.FrontendUrl + path
}

func BuildCodeMarkdown(text string) string {
	return "```" + text + "```"
}

func ForSendTransactionForUser(from, to string, bnb, usd float64) string {
	return fmt.Sprintf(`📩 Transaction: 

@%s
send 
@%s:

%v BNB

it's about: $%v`, from, to, bnb, usd)
}
