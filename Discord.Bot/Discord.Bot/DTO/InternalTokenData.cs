namespace Discord.Bot.DTO
{
    using Newtonsoft.Json;

    public class InternalTokenData
    {
        [JsonProperty("amount")]
        public decimal Amount { get; set; }

        [JsonProperty("currency")]
        public string Currency { get; set; }

        [JsonProperty("token")]
        public string Token { get; set; }

        [JsonProperty("usd", NullValueHandling = NullValueHandling.Ignore)]
        public decimal? Usd { get; set; }
    }
}