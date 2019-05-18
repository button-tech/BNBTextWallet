namespace Discord.Bot.Services
{
    using System;
    using System.Linq;
    using System.Net.Http;
    using System.Threading.Tasks;
    using DTO;
    using Newtonsoft.Json;

    public class CoursesService
    {
        private enum AvailableCurrency
        {
            ETH,
        }
        
        private static readonly string[] Currency = Enum.GetValues(typeof(AvailableCurrency))
            .Cast<AvailableCurrency>()
            .Select(x => x.ToString())
            .ToArray();

        private readonly IHttpClientFactory httpClientFactory;
        private readonly Func<DateTimeOffset> now;

        public CoursesService(IHttpClientFactory httpClientFactory,
            Func<DateTimeOffset> now)
        {
            this.httpClientFactory = httpClientFactory;
            this.now = now;
        }

        private HttpClient ApiClient => httpClientFactory.CreateClient();


        private static string GetMultipleUrl(string[] currency)
        {
            return
                $"https://min-api.cryptocompare.com/data/pricemulti?fsyms={string.Join(',', currency)}&tsyms=USD,EUR,RUB";
        }

        private static string GetSingleUrl(string currency)
        {
            return $"https://min-api.cryptocompare.com/data/price?fsym={currency}&tsyms=USD,EUR,RUB";
        }

        public Task<CoursesStamp> GetTokenCourse(string tokenShortName)
        {
            return RequestSingle<CoursesStamp>(tokenShortName);
        }

        public Task<Courses> GetCryptoCourses()
        {
            return RequestMulti<Courses>(Currency);
        }

        private async Task<T> RequestSingle<T>(string currency)
        {
            var response = await ApiClient.GetAsync(GetSingleUrl(currency));
            var content = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<T>(content);
        }

        private async Task<T> RequestMulti<T>(string[] currency)
        {
            var response = await ApiClient.GetAsync(GetMultipleUrl(currency));
            var content = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<T>(content);
        }
    }
}