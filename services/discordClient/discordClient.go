package discordClient

import (
	"github.com/bwmarrin/discordgo"
	"log"
)

var Client *DiscordClient

type DiscordClient struct {
	Session *discordgo.Session
}

func (client *DiscordClient) SendMessage(channelId, msg string) *discordgo.Message {
	message, err := client.Session.ChannelMessageSend(channelId, msg)
	if err != nil {
		log.Println(err)
		return nil
	}

	return message
}

func (client *DiscordClient) SendPrivateMessage(authorId, msg string) *discordgo.Message {
	channel, err := client.Session.UserChannelCreate(authorId)
	if err != nil {
		log.Println(err)
		return nil
	}
	message, err := client.Session.ChannelMessageSend(channel.ID, msg)
	if err != nil {
		log.Println(err)
		return nil
	}

	return message
}

func (client *DiscordClient) UpdateStatus() {
	if err := client.Session.UpdateStatus(0, "A friendly ButtonWallet bot!"); err != nil {
		log.Println(err)
	}
}

func (client *DiscordClient) Close() {
	if err := client.Session.Close(); err != nil {
		log.Println(err)
	}
}
