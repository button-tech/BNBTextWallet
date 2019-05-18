namespace Discord.Bot.EF.Repository
{
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using DTO;

    public class GuidRepository
    {
        private readonly Func<DateTimeOffset> now;

        public GuidRepository(Func<DateTimeOffset> now)
        {
            this.now = now;
            
            cache = new Dictionary<string, DiscordGuidStamp>();
        }
        private readonly Dictionary<string, DiscordGuidStamp> cache;

        public Task<DiscordGuidStamp> ReadGuidAsync(string guid)
        {
            if (!cache.ContainsKey(guid))
                return null;

            cache.TryGetValue(guid, out var result);

            return Task.FromResult(result);
        }

        public Task DeleteGuidAsync(string guid)
        {
            cache.Remove(guid);

            return Task.CompletedTask;
        }

        public Task CreateOrUpdateGuidAsync(string guid, DiscordGuidStamp guidStamp)
        {

            guidStamp.LifetimeToDelete = now() + TimeSpan.FromMinutes(15);
            
            cache.Add(guid, guidStamp);

            return Task.CompletedTask;
        }
    }
}