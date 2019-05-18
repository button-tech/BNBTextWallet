namespace Discord.Bot.Services
{
    using System;
    using System.Threading.Tasks;
    using DTO;
    using EF.Repository;

    public class GuidService
    {
        private static readonly Random Random = new Random(DateTimeOffset.Now.Millisecond);
        private readonly GuidRepository guidRepository;
        private readonly Func<DateTimeOffset> now;

        public GuidService(Func<DateTimeOffset> now, GuidRepository guidRepository)
        {
            this.now = now;
            this.guidRepository = guidRepository;
        }

        public async Task<string> GenerateString(ulong identifier, string nickname,
            TransactionData transactionData = null)
        {
            var str = (Random.Next(1, int.MaxValue) >> now().Millisecond).ToString();

            var guid = Guid.NewGuid().ToString();

            var stringGuid = $"{guid.Substring(0, 10)}{str}";

            var stamp = new DiscordGuidStamp
            {
                Identifier = identifier,
                NickName = nickname,
                TransactionData = transactionData
            };

            await guidRepository.CreateOrUpdateGuidAsync(stringGuid, stamp);
            return stringGuid;
        }

        public Task DeleteGuid(string guid)
        {
            return guidRepository.DeleteGuidAsync(guid);
        }

        public async Task<bool> ValidateString(string guid)
        {
            var telegramGuidStamp = await guidRepository.ReadGuidAsync(guid);
            return telegramGuidStamp != null;
        }

        public async Task<DateTimeOffset> GetLifetime(string guid)
        {
            var telegramGuidStamp = await guidRepository.ReadGuidAsync(guid);
            return telegramGuidStamp.LifetimeToDelete;
        }

        public Task<DiscordGuidStamp> GetGuidStamp(string guid)
        {
            return guidRepository.ReadGuidAsync(guid);
        }
    }
}