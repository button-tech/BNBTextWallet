namespace Discord.Bot.DTO
{
    using System;

    public class MultiCurrencyStamp
    {
        public decimal Eth { get; set; }
        public DateTimeOffset TimeStamp { get; set; }
    }
}