namespace Discord.Bot
{
    using System;
    using System.Collections.Concurrent;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using DTO;
    using EF.Data;
    using Services;
    using WebSocket;

    public class DiscordClient
    {
        private readonly GuidService guidService;
        private readonly CoursesService coursesService;
        private readonly BalanceService balanceService;
        private readonly AccountService accountService;
        private readonly BinanceService binanceService;
        private readonly HostConfig config;
        private readonly DiscordSocketClient client;

        public DiscordClient(GuidService guidService,
            CoursesService coursesService,
            BalanceService balanceService,
            AccountService accountService,
            BinanceService binanceService,
            HostConfig config)
        {
            this.guidService = guidService;
            this.coursesService = coursesService;
            this.balanceService = balanceService;
            this.accountService = accountService;
            this.binanceService = binanceService;
            this.config = config;

            client = new DiscordSocketClient();

            client.Log += LogAsync;
            client.Ready += ReadyAsync;
            client.MessageReceived += MessageReceivedAsync;
        }

        public async Task Init()
        {
            var token = config.DiscordBotToken;
            await client.LoginAsync(TokenType.Bot, token);
            await client.StartAsync();
        }

        private Task LogAsync(LogMessage log)
        {
            Console.WriteLine(log.ToString());
            return Task.CompletedTask;
        }

        private Task ReadyAsync()
        {
            Console.WriteLine($"{client.CurrentUser} is connected!");

            return Task.CompletedTask;
        }

        private async Task MessageReceivedAsync(SocketMessage message)
        {
            if (message.Author.Id == client.CurrentUser.Id)
                return;

            if (message.Content == "/create")
                await Create(message);

            if (message.Content == "/import")
                await Import(message);

            if (message.Content == "/balance")
                await Balance(message);

            if (message.Content == "/help")
                await Help(message);

            if (message.Content.Contains("/send"))
                await Send(message);

            if (message.Content.Contains("/symbols"))
                await Symbols(message);

            if (message.Content.Contains("/orders"))
                await Orders(message);

            if (message.Content.Contains("/sell_order"))
                await SellOrder(message);

            if (message.Content.Contains("/buy_order"))
                await BuyOrder(message);

            if (message.Content.Contains("/address"))
                await Address(message);
        }

        private async Task Address(SocketMessage message)
        {
            var author = message.Author;
            var acc = await accountService.ReadUser(author.Id);

            var text = $"Ethereum\n{acc.EthereumAddress}\n\nBinance Coin\n{acc.BinanceAddress}";

            await message.Channel.SendMessageAsync(text);
        }

        private async Task BuyOrder(SocketMessage message)
        {
            var args = message.Content.Split(' ');
            var symbol = args[1];
            var amount = args[2];
            var price = args[3];

            var url = $"{config.FrontAddress}/dex/?operation=buy&amount={amount}&price={price}&symbol={symbol}";

            await message.Channel.SendMessageAsync(url);
        }

        private async Task SellOrder(SocketMessage message)
        {
            var args = message.Content.Split(' ');
            var symbol = args[1];
            var amount = args[2];
            var price = args[3];

            var url = $"{config.FrontAddress}/dex/?operation=sell&amount={amount}&price={price}&symbol={symbol}";

            await message.Channel.SendMessageAsync(url);
        }

        private async Task Orders(SocketMessage message)
        {
            var author = message.Author;

            var orders = await binanceService.GetOrders(author.Id);

            if (orders?.order.Length == 0)
                await message.Channel.SendMessageAsync("You have no open orders :(");
            else
            {
                var text = orders?.order.Take(10).Select(x => $"{x.ToString()}\n")
                    .Aggregate("", (s, s1) => s + s1);

                await message.Channel.SendMessageAsync(text);
            }
        }

        private async Task Symbols(SocketMessage message)
        {
            var count = message.Content.Split(' ');
            var toSelect = 10;
            if (count.Length > 1)
                toSelect = int.Parse(count[1]);

            var symbolMaps = await binanceService.GetSymbols();

            var result = symbolMaps.Take(toSelect).Select(x => $"{x.ToString()}\n")
                .Aggregate("", (s, s1) => s + s1);

            await message.Channel.SendMessageAsync(result);
        }

        private async Task Help(SocketMessage message)
        {
            const string text =
                "**Hello**, welcome to the BUTTON Wallet on Discord. You can send **BNB** transactions and trade on **DEX**! \nJust enter any of this commands.\n\n**Command  Parameters  Description **\n\n**/create** - *Create a wallet*\n\n**/import** - *Import a wallet*\n\n**/balance** - *Balance of all current currencies*\n\n**/send** (token) (amount) (address or nickname) - *Send a crypto*\n\n**/sell_order** (symbol) (amount) (price) - *Put a sell order on Binance DEX* 🔶\n\n**/buy_order** (symbol) (amount) (price) - *Put a buy order on Binance DEX* 🔶\n\n**/orders** - *Show all your Binance DEX orders* 🔥\n\n**/symbols** - *Show all Binance DEX exchange pairs* 🔄";

            await message.Channel.SendMessageAsync(text);
        }

        private async Task Balance(SocketMessage message)
        {
            var author = message.Author;

            var bnb = await balanceService.GetBnbBalance(author.Id);
            var bnbCourse = 27.61m;
            var bnbUsd = bnb * bnbCourse;

            var bnbText = FormatBalance("BNB", " Binance Coin", bnb, bnbUsd);

            var totalSum = $"Total ≈ {bnbUsd:0.00}$";

            var answer = $"{bnbText}{totalSum}";

            await message.Channel.SendMessageAsync(answer);
        }

        private string FormatBalance(string symbol, string fullName, decimal sum, decimal dollarSum)
        {
            return $"{fullName} (*{symbol}*)\n{sum:0.00000000} ≈ {dollarSum:0.00}$\n\n";
        }

        private async Task Create(SocketMessage message)
        {
            var author = message.Author;

            var acc = await accountService.ReadUser(author.Id);
            if (acc != null)
            {
                var text = "Sorry, you already registered :(";
                await message.Channel.SendMessageAsync(text);
                return;
            }

            var guid = await guidService.GenerateString(author.Id, author.Username);

            var url = $"{config.FrontAddress}/create/?create={guid}";

            await message.Channel.SendMessageAsync(url);
        }

        private async Task Import(SocketMessage message)
        {
            var author = message.Author;

            var acc = await accountService.ReadUser(author.Id);
            if (acc != null)
            {
                var text = "Sorry, you already registered :(";
                await message.Channel.SendMessageAsync(text);
                return;
            }

            var guid = await guidService.GenerateString(author.Id, author.Username);

            var url = $"{config.FrontAddress}/import/?import={guid}";

            await message.Channel.SendMessageAsync(url);
        }

        //  /send token amount (address or nickname, or ENS) - *Send a crypto* 
        private async Task Send(SocketMessage message)
        {
            var args = message.Content.Split(' ');
            var amount = args[1];
            var destination = args[2];

            var author = await accountService.ReadUser(message.Author.Id);

            var (_, type) = NickConverter.Convert(destination);

            if (type == TransactionDestination.Nick)
            {
                var dest = await accountService.ReadUser(destination);
                var trData = new TransactionData
                {
                    Currency = "BNB",
                    From = GetAddress("BNB", author),
                    To = GetAddress("BNB", dest),
                    Value = amount
                };

                var guid = await guidService.GenerateString(author.Identifier, author.NickName, trData);
                var url = GetSendUrl(guid);

                await message.Channel.SendMessageAsync(url);
            }

            if (type == TransactionDestination.Wallet)
            {
                var trData = new TransactionData
                {
                    Currency = "BNB",
                    From = GetAddress("BNB", author),
                    To = destination,
                    Value = amount
                };

                var guid = await guidService.GenerateString(author.Identifier, author.NickName, trData);
                var url = GetSendUrl(guid);

                await message.Channel.SendMessageAsync(url);
            }
        }

        private string GetSendUrl(string guid)
        {
           return $"{config.FrontAddress}/send/?tx={guid}";
        }

        private string GetAddress(string token, DiscordUserData data)
        {
            return data.BinanceAddress;
        }
    }
}