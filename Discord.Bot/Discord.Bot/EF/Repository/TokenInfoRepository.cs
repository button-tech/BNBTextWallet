namespace Discord.Bot.EF.Repository
{
    using System;
    using System.Threading.Tasks;
    using Data;
    using Microsoft.EntityFrameworkCore;

    public class TokenInfoRepository
    {
        private readonly Func<HackContext> dbFactory;

        public TokenInfoRepository(Func<HackContext> dbFactory)
        {
            this.dbFactory = dbFactory;
        }

        private HackContext DbContext => dbFactory();

        public async Task<TokenInfoData> ReadAsync(string shortName)
        {
            return await DbContext.TokenInfos.AsNoTracking()
                .SingleOrDefaultAsync(x => string.Equals(x.TokenSymbol, shortName,
                    StringComparison
                        .InvariantCultureIgnoreCase));
        }

        public Task<TokenInfoData[]> ReadAllAsync()
        {
            return DbContext.TokenInfos.AsNoTracking()
                .ToArrayAsync();
        }
    }
}