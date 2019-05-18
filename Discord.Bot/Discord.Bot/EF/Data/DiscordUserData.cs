namespace Discord.Bot.EF.Data
{
    using System;

    public class DiscordUserData
    {
        public long Id { get; set; }

        public ulong Identifier { get; set; }
        
        public string NickName { get; set; }
        
        public string EthereumAddress { get; set; }

        public DateTimeOffset FirstActionTime { get; set; }
    }
}