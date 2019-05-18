namespace Discord.Bot.EF.Data
{
    public class TokenInfoData
    {
        public long Id { get; set; }

        public string TokenName { get; set; }

        public string TokenSymbol { get; set; }

        public string TokenAddress { get; set; }

        public decimal Decimals { get; set; }
    }
}