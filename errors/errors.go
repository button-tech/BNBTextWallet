package typedErrors

import "errors"

var (
	InvalidSendMessage = errors.New("invalid send message")
	UserNotFound       = errors.New("user not found")
)
