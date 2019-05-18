namespace Discord.Bot.Services
{
    using System;
    using System.Threading.Tasks;
    using EF;
    using EF.Data;
    using Microsoft.EntityFrameworkCore;

    public class AccountService
    {
        private readonly Func<HackContext> dbFactory;
        private readonly Func<DateTimeOffset> now;
        private HackContext DbContext => dbFactory();

        public AccountService(Func<HackContext> dbFactory,
            Func<DateTimeOffset> now)
        {
            this.dbFactory = dbFactory;
            this.now = now;
        }

        public Task<DiscordUserData> ReadUser(ulong identifier)
        {
            return DbContext.Users.FirstOrDefaultAsync(x => x.Identifier == identifier);
        }

        public async Task CreateTelegramUser(ulong identifier, string nickName)
        {
            var ctx = DbContext;
            var user = new DiscordUserData
            {
                Identifier = identifier,
                NickName = nickName,
                FirstActionTime = now()
            };

            ctx.Users.Add(user);

            await ctx.SaveChangesAsync();
        }

        public async Task UpdateAsync(DiscordUserData user)
        {
            if (user == null) return;

            var ctx = DbContext;
            ctx.Entry(user).State = EntityState.Modified;
            await ctx.SaveChangesAsync();
        }

        public async Task<bool> IsExistAsync(ulong identifier)
        {
            var user = await ReadUser(identifier);
            return user != null;
        }
    }
}