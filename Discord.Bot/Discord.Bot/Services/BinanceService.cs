namespace Discord.Bot.Services
{
    using System;
    using System.Linq;
    using System.Net.Http;
    using System.Threading.Tasks;
    using Newtonsoft.Json;

    public class BinanceService
    {
        private readonly IHttpClientFactory factory;
        private readonly AccountService accountService;

        private HttpClient ApiClient => factory.CreateClient();

        public BinanceService(IHttpClientFactory httpClientFactory,
            AccountService accountService)
        {
            factory = httpClientFactory;
            this.accountService = accountService;
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

        private const string SymbolsUrl = "https://testnet-dex.binance.org/api/v1/markets";
        private string OrderUrl(string a) => $"https://testnet-dex.binance.org/api/v1/orders/open?address={a}";

        public async Task<SymbolMap[]> GetSymbols()
        {
            var symbols = await MakeRequestAsync<BinanceSymbol[]>(SymbolsUrl);

            var result = symbols.Select(x => new SymbolMap
            {
                Base = x.base_asset_symbol,
                Quote = x.quote_asset_symbol
            });

            return result.ToArray();
        }

        public async Task<OrderList> GetOrders(ulong identifier)
        {
            var acc = await accountService.ReadUser(identifier);

            var result = await MakeRequestAsync<OrderList>(OrderUrl(acc.BinanceAddress));

            return result;
        }
    }

    public class SymbolMap
    {
        public string Base { get; set; }

        public string Quote { get; set; }

        public override string ToString()
        {
            return $"{Base} => {Quote}";
        }
    }

    public class BinanceSymbol
    {
        public string base_asset_symbol { get; set; }
        public string list_price { get; set; }
        public string lot_size { get; set; }
        public string quote_asset_symbol { get; set; }
        public string tick_size { get; set; }
    }

    public class Order
    {
        public string orderId { get; set; }
        public string symbol { get; set; }
        public string owner { get; set; }
        public string price { get; set; }
        public string quantity { get; set; }
        public string cumulateQuantity { get; set; }
        public string fee { get; set; }
        public DateTime orderCreateTime { get; set; }
        public DateTime transactionTime { get; set; }
        public string status { get; set; }
        public int timeInForce { get; set; }
        public int side { get; set; }
        public int type { get; set; }
        public string tradeId { get; set; }
        public string lastExecutedPrice { get; set; }
        public string lastExecutedQuantity { get; set; }
        public string transactionHash { get; set; }

        public override string ToString()
        {
            return $"{symbol}; Type {type}; Price {price}";
        }
    }

    public class OrderList
    {
        public Order[] order { get; set; }
        public int total { get; set; }
    }
}