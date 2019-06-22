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
      

            return default(T);
        }


        private string GetBnbUrl(string bnb)
        {
            return $"https://testnet-dex-asiapacific.binance.org/api/v1/account/{bnb}";
        }


        public async Task<decimal> GetBnbBalance(ulong identifier)
        {
            var dbUser = await accountService.ReadUser(identifier);
            try
            {
                var bnb = await MakeRequestAsync<Bnb>(GetBnbUrl(dbUser.BinanceAddress));
                var mb = bnb.balances.FirstOrDefault(x => x.symbol.ToUpperInvariant() == "BNB");

                decimal.TryParse(mb?.free, out var result);
                return mb != null ? result : 0m;
            }
            catch (Exception)
            {
                return 0m;
            }
        }
    }
}