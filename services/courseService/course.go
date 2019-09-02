package courseService

import (
	"github.com/imroc/req"
)

type BnBCourse struct {
	USD float64 `json:"USD"`
}

func (c *BnBCourse) GetBnBCourse() error {
	r := req.New()
	url := "https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=USD"

	resp, err := r.Get(url)
	if err != nil {
		return err
	}

	if err = resp.ToJSON(c); err != nil {
		return err
	}

	return nil
}
