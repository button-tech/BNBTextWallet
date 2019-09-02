package helpers

import (
	"strconv"
	"strings"
)

func SumConverter(amount string) (float64, bool, error) {
	val, err := strconv.ParseFloat(amount, 64)
	if err != nil {
		s := strings.Trim(amount, "$")
		if val, err = strconv.ParseFloat(s, 64); err != nil {

			return 0, false, err
		}

		return val, false, nil
	}

	return val, true, nil
}
