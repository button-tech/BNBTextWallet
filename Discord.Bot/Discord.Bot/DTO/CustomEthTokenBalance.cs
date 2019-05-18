namespace Discord.Bot.DTO
{
    using Newtonsoft.Json;
    using Services;

    public class CustomEthTokenBalance
    {
        [JsonProperty("data")]
        public InternalTokenData[] Data { get; set; }

        [JsonProperty("total_usd")]
        public decimal TotalUsd { get; set; }
    }
}