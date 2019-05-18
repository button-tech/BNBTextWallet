namespace Discord.Bot.DTO
{
    public class TokenBalanceView
    {
        public TokenBalanceView(TokenBalanceStamp data, decimal course)
        {
            Balance = data.Balance;
            Symbol = data.Symbol;
            FullName = data.FullName;
            Course = course;
        }

        public decimal Balance { get; }
        public string Symbol { get; }
        public string FullName { get; }
        public decimal Course { get; }
        public decimal Cost => Balance * Course;
    }
}