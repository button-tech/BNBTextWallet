package balanceUtils

import (
	"github.com/jeyldii/discordik/services/balanceService"
	"github.com/jeyldii/discordik/services/courseService"
	"log"
	"sync"
)

type FundsData struct {
	Balance *balanceService.Balances
	Course  *courseService.BnBCourse
}

func (fundsData *FundsData) GetBalanceAndCourse(address string) error {
	var wg sync.WaitGroup
	wg.Add(2)

	var balance balanceService.Balances
	var course courseService.BnBCourse
	var balanceErr error
	var courseErr error

	go func() {
		defer wg.Done()
		err := course.GetBnBCourse()
		if err != nil {
			courseErr = err

			return
		}
	}()

	go func() {
		defer wg.Done()
		err := balance.GetBalances(address)
		if err != nil {
			balanceErr = err

			return
		}
	}()

	wg.Wait()

	if balanceErr != nil {
		log.Println(balanceErr)
		return balanceErr
	} else if courseErr != nil {
		log.Println(balanceErr)
		return courseErr
	}

	fundsData.Course = &course
	fundsData.Balance = &balance
	return nil
}
