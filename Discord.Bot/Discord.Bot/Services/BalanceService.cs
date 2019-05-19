namespace Discord.Bot.Services
{
    using System;
    using System.Linq;
    using System.Net.Http;
    using System.Threading.Tasks;
    using DTO;
    using EF.Repository;
    using Newtonsoft.Json;

    public class BalanceService
    {
        private readonly IHttpClientFactory httpClientFactory;
        private readonly Func<DateTimeOffset> now;
        private readonly AccountService accountService;
        private readonly HostConfig config;
        private readonly TokenInfoRepository tokenInfoRepository;
        private const decimal EthPointer = 1e-18m;

        private HttpClient ApiClient => httpClientFactory.CreateClient();

        public BalanceService(IHttpClientFactory httpClientFactory,
            Func<DateTimeOffset> now,
            AccountService accountService,
            HostConfig config,
            TokenInfoRepository tokenInfoRepository)
        {
            this.httpClientFactory = httpClientFactory;
            this.now = now;
            this.accountService = accountService;
            this.config = config;
            this.tokenInfoRepository = tokenInfoRepository;
        }

        public async Task<decimal> GetErc20TokenBalanceAsync(ulong identifier, string scSymbol)
        {
            var dbUser = await accountService.ReadUser(identifier);
            var eth = dbUser.EthereumAddress;
            var token = await tokenInfoRepository.ReadAsync(scSymbol);
            var balance = await MakeRequestAsync<CustomBalance>(GetTokenUrl(token.TokenAddress, eth));
            return balance.Balance * 10m.Pow(-token.Decimals);
        }

        public async Task<TokenBalanceStamp[]> GetAllErc20TokenBalancesAsync(ulong identifier)
        {
            var dbUser = await accountService.ReadUser(identifier);

            var eth = dbUser.EthereumAddress;

            var tokenBalance = await MakeRequestAsync<CustomEthTokenBalance>(GetEthScanTokenUrl(eth));

            var tokens = await tokenInfoRepository.ReadAllAsync();

            if (tokenBalance == null)
            {
                tokenBalance = new CustomEthTokenBalance
                {
                    Data = new InternalTokenData[0]
                };
            }

            return tokenBalance.Data.Select(x => new TokenBalanceStamp
            {
                Balance = x.Amount,
                Symbol = x.Currency,
                FullName = tokens.FirstOrDefault(y => y.TokenSymbol == x.Currency)?.TokenName ?? string.Empty
            }).ToArray();
        }

        private string GetEthScanTokenUrl(string ethAddress)
        {
            return $"{config.ButtonNodeApi}/tokenBalance/{ethAddress}";
        }

        public async Task<MultiCurrencyStamp> GetBalances(ulong identifier)
        {
            var dbUser = await accountService.ReadUser(identifier);
            var eth = await MakeRequestAsync<CustomBalance>(GetEthUrl(dbUser.EthereumAddress));

            var stamp = new MultiCurrencyStamp
            {
                Eth = eth.Balance * EthPointer,
                TimeStamp = now()
            };

            return stamp;
        }

        private async Task<T> MakeRequestAsync<T>(string url)
        {
            try
            {
                var response = await ApiClient.GetAsync(url);
                var content = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<T>(content);
            }
            catch (JsonException)
            {
                //ignore
            }
            catch (Exception ex)
            {
                // ignore
            }

            return default(T);
        }

        private string GetTokenUrl(string erc20Address, string ethAddress)
        {
            return $"{config.ButtonNodeApi}/eth/tokenBalance/{erc20Address}/{ethAddress}";
        }

        private string GetBnbUrl(string bnb)
        {
            return $"https://testnet-dex-asiapacific.binance.org/api/v1/account/{bnb}";
        }

        private string GetEthUrl(string address)
        {
            return $"{config.ButtonNodeApi}/eth/balance/{address}";
        }

        private string GetEncUrl(string enc)
        {
            return $"{config.ButtonNodeApi}/ens/{enc}";
        }

        public async Task<string> GetEnc(string address)
        {
            var response = await MakeRequestAsync<EncResponse>(GetEncUrl(address));
            return response.resp;
        }

        public async Task<decimal> GetBnbBalance(ulong identifier)
        {
            var dbUser = await accountService.ReadUser(identifier);
            try
            {
                var bnb = await MakeRequestAsync<BnbRoot>(GetBnbUrl(dbUser.BinanceAddress));
                var mb = bnb.balances.FirstOrDefault(x => x.symbol.ToUpperInvariant() == "BNB");

                decimal.TryParse(mb?.free, out var result);
                return mb != null ? result : 0m;
            }
            catch (Exception ex)
            {
                return 0m;
            }
        }
    }
}