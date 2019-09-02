package helpers

import "strings"

func NickConvert(destination string) (string, bool) {
	metaFlag := strings.HasPrefix(destination, "bnb")
	if metaFlag && len(destination) == 42 {
		return destination, false
	}

	return destination, true
}
