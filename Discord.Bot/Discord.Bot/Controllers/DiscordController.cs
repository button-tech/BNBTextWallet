using Microsoft.AspNetCore.Mvc;

namespace Discord.Bot.Controllers
{
    using System.Threading.Tasks;
    using DTO;
    using Services;

    [Route("api/[controller]")]
    [ApiController]
    public class DiscordController : Controller
    {
        private readonly GuidService guidService;
        private readonly AccountService accountService;

        public DiscordController(GuidService guidService,
            AccountService accountService)
        {
            this.guidService = guidService;
            this.accountService = accountService;
        }

        [HttpPut("create/{guid}")]
        public async Task<object> CreateWallet([FromBody] WalletStamp walletStamp, string guid)
        {
            var isGuidValid = await guidService.ValidateString(guid);
            if (!isGuidValid)
            {
                var res = Json(new
                    {
                        error = "Guid is not exist",
                        result = default(string)
                    })
                    .Value;
                return NotFound(res);
            }

            var guidStamp = await guidService.GetGuidStamp(guid);

            var isUserExist = await accountService.IsExistAsync(guidStamp.Identifier);
            if (!isUserExist)
                await accountService.CreateTelegramUser(guidStamp.Identifier, guidStamp.NickName ?? string.Empty);

            var user = await accountService.ReadUser(guidStamp.Identifier);

            if (user.EthereumAddress != null)
            {
                //await BotClient.SendTextMessageAsync(guidStamp.ChatId, "Sorry, account already exists");

                var res = Json(new
                    {
                        error = "Guid is not exist",
                        result = default(string)
                    })
                    .Value;

                return NotFound(res);
            }

            user.EthereumAddress = walletStamp.EthereumAddress;

            await accountService.UpdateAsync(user);

            //var update = GenerateBotUpdate(guidStamp);

            return Json(new
            {
                error = default(string),
                result = "success"
            });
        }
    }
}