namespace Discord.Bot
{
    using System;
    using System.Collections.Concurrent;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using DTO;
    using Services;
    using WebSocket;

    public class DiscordClient
    {
        private readonly GuidService guidService;
        private readonly CoursesService coursesService;
        private readonly BalanceService balanceService;
        private readonly HostConfig config;
        private readonly DiscordSocketClient client;

        public DiscordClient(GuidService guidService,
            CoursesService coursesService,
            BalanceService balanceService,
            HostConfig config)
        {
            this.guidService = guidService;
            this.coursesService = coursesService;
            this.balanceService = balanceService;
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

            if (message.Content == "!ping")
                await message.Channel.SendMessageAsync("ты че пес");

            if (message.Content == "/create")
                await Create(message);

            if (message.Content == "/balance")
                await Balance(message);
            
            if (message.Content == "/token")
                await TokenBalance(message);
        }

        private async Task Balance(SocketMessage message)
        {
            var author = message.Author;

            var eth = await balanceService.GetBalances(author.Id);
            var ethCourses = await coursesService.GetCryptoCourses();
            var ethUsd = eth.Eth * ethCourses.ETH.USD;

            var dai = await balanceService.GetErc20TokenBalanceAsync(author.Id, "DAI");
            var daiCourse = await coursesService.GetTokenCourse("DAI");
            var daiUsd = daiCourse.USD * dai;


            var ethText = FormatBalance("ETH", "Ethereum", eth.Eth, ethUsd);
            var daiText = FormatBalance("DAI", "Dai Stablecoin v1.0", dai, daiUsd);

            var totalSum = $"Total ≈ {ethUsd + daiUsd:0.00}$";

            var answer = $"{ethText}{daiText}{totalSum}";

            await message.Channel.SendMessageAsync(answer);
        }

        private async Task TokenBalance(SocketMessage message)
        {
            var author = message.Author;

            var resultMessage = string.Empty;
            var resultSum = 0m;

            var balances = await GetTokenBalances(author.Id);

            if (balances.Length > 0)
            {
                var first20 = balances.Take(20);
                var tokens = first20 as TokenBalanceView[] ?? first20.OrderByDescending(x => x.Cost)
                                 .ToArray();

                var tokenText = new StringBuilder();

                foreach (var data in tokens)
                    tokenText.Append(FormatBalance(data.Symbol, data.FullName, data.Balance, data.Cost));

                resultSum = tokens.Sum(x => x.Cost);

                resultMessage += tokenText.ToString();
            }

            var totalSum = $"Total ≈ {resultSum:0.00}$";

            await message.Channel.SendMessageAsync(resultMessage + totalSum);
        }

        private async Task<TokenBalanceView[]> GetTokenBalances(ulong identifier)
        {
            var balances = await balanceService.GetAllErc20TokenBalancesAsync(identifier);
            var balanceViews = new ConcurrentBag<TokenBalanceView>();

            async Task DoWork(TokenBalanceStamp balanceStamp)
            {
                var course = await coursesService.GetTokenCourse(balanceStamp.Symbol.ToUpperInvariant());
                balanceViews.Add(new TokenBalanceView(balanceStamp, course.USD));
            }

            var tasks = balances.Select(DoWork);
            await Task.WhenAll(tasks.ToArray());

            return balanceViews.ToArray();
        }

        private string FormatBalance(string symbol, string fullName, decimal sum, decimal dollarSum)
        {
            return $"{fullName} (*{symbol}*)\n{sum:0.00000000} ≈ {dollarSum:0.00}$\n\n";
        }

        private async Task Create(SocketMessage message)
        {
            var author = message.Author;

            var guid = await guidService.GenerateString(author.Id, author.Username);

            var url = $"{config.FrontAddress}/create/?create={guid}";

            await message.Channel.SendMessageAsync(url);
        }
    }
}