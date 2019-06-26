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
        private readonly HostConfig config;
        private readonly DiscordSocketClient client;

        public DiscordClient(GuidService guidService,
            CoursesService coursesService,
            BalanceService balanceService,
            AccountService accountService,

            HostConfig config)
        {
            this.guidService = guidService;
            this.coursesService = coursesService;
            this.balanceService = balanceService;
            this.accountService = accountService;
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

            if (message.Content.Contains("/address"))
                await Address(message);
        }

        private async Task Address(SocketMessage message)
        {
            var author = message.Author;
            var acc = await accountService.ReadUser(author.Id);

            var text = $"Binance Coin\n{acc.BinanceAddress}";

            await message.Channel.SendMessageAsync(text);
        }


        private async Task Help(SocketMessage message)
        {
            const string text =
                "**Hello**, welcome to the BUTTON Wallet on Discord. You can create accout or import QR/mnemonic and send **BNB** to your friedns! \nJust enter any of this commands.\n\n**Command  Parameters  Description **\n\n**/create** - *Create a wallet*\n\n**/import** - *Import a wallet*\n\n**/balance** - *Balance of all current currencies*\n\n**/send** (amount) (address or nickname) - *Send BNB*";

            await message.Channel.SendMessageAsync(text);
        }

        private async Task Balance(SocketMessage message)
        {
            var author = message.Author;

            var bnb = await balanceService.GetBnbBalance(author.Id);
            var bnbCourse = 27.61m;
            var bnbUsd = bnb * bnbCourse;

            var bnbText = FormatBalance("BNB", " Binance Coin", bnb, bnbUsd);

            var answer = $"{bnbText}";

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

        //    var acc = await accountService.ReadUser(author.Id);
        //    if (acc != null)
         //   {
          //      var text = "Sorry, you already registered :(";
          //      await message.Channel.SendMessageAsync(text);
           //     return;
           // }

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