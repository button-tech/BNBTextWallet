namespace Discord.Bot.DTO
{
    using System;
    using Services;

    public class DiscordGuidStamp
    {
        public ulong Identifier { get; set; }

        public string NickName { get; set; }

        public TransactionData TransactionData { get; set; }

        public DateTimeOffset LifetimeToDelete { get; set; }
    }
}