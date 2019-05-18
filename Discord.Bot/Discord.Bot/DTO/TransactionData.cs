namespace Discord.Bot.DTO
{
    public class TransactionData
    {
        public string Currency { get; set; }
        public string From { get; set; }
        public string To { get; set; }
        public string Nickname { get; set; }
        public string FromNickName { get; set; }
        public string Value { get; set; }
        public string ValueInUsd { get; set; }
        public long FromChatId { get; set; }
        public long? ToChatId { get; set; }
    }
}