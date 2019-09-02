package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/jeyldii/discordik/db"
	"github.com/jeyldii/discordik/db/models"
	"github.com/jeyldii/discordik/messages"
	. "github.com/jeyldii/discordik/services/discordClient"
	"github.com/jeyldii/discordik/services/discordUserProvider"
	"github.com/jeyldii/discordik/services/guidService"
	"log"
	"net/http"
)

type BnbAddr struct {
	BnbAddress string `json:"BinanceAddress"`
}

type HashTransaction struct {
	Hash string `json:"txHash"`
}

func CreateWallet(c *gin.Context) {
	var address BnbAddr

	if err := c.ShouldBindJSON(&address); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	guid := c.Param("guid")

	stamp, err := guidService.Read(guid)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err})

		return
	}

	user := models.User{
		Username:   stamp.Nickname,
		BnbAddress: address.BnbAddress,
		Identifier: stamp.Identifier,
	}

	if err := discordUserProvider.UpdateUser(&user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	Client.SendMessage(stamp.ChannelId, messages.Welcome(stamp.Nickname))

	if err := guidService.Delete(stamp.Guid); err != nil {
		log.Println(err)
	}

	c.JSON(201, gin.H{"result": "ok"})
}

func Transaction(c *gin.Context) {
	guid := c.Param("guid")
	stamp, err := guidService.Read(guid)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusNotFound, gin.H{"error": "guid not found"})

		return
	}

	c.JSON(http.StatusOK, stamp.TransactionData)
}

func InsertTransactionHash(c *gin.Context) {
	var txHash HashTransaction
	if err := c.ShouldBindJSON(&txHash); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	guid := c.Param("guid")
	stamp, err := guidService.Read(guid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	stamp.TransactionData.TxHash = txHash.Hash

	if err := db.InsertTransactionData(&stamp); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}

	var msg string
	if stamp.TransactionData.NicknameTo == "" {
		msg = messages.ForSendTransactionForUser(
			stamp.TransactionData.NicknameFrom, stamp.TransactionData.AddressTo,
			stamp.TransactionData.Amount, stamp.TransactionData.AmountUSD)
	} else {
		msg = messages.ForSendTransactionForUser(
			stamp.TransactionData.NicknameFrom, stamp.TransactionData.NicknameTo,
			stamp.TransactionData.Amount, stamp.TransactionData.AmountUSD)
	}

	Client.SendPrivateMessage(stamp.Identifier, msg)

	if err := guidService.Delete(stamp.Guid); err != nil {
		log.Println(err)
	}

	c.JSON(200, gin.H{"result": "ok"})
}
