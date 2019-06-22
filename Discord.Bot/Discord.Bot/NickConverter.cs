namespace Discord.Bot
{
    using System.Text.RegularExpressions;

    public class NickConverter
    {
        //Eth
        private static readonly Regex EthRegex = new Regex(@"^0x[a-fA-F0-9]{40}$");

        private static bool IsBNB(string input)
        {
            return input.StartsWith("tbnb") && input.Length == 43;
        }

        public static (string, TransactionDestination) Convert(string inp)
        {
            if (string.IsNullOrEmpty(inp))
                return (string.Empty, TransactionDestination.Undefined);

            if (inp.StartsWith('@'))
                return (inp, TransactionDestination.Nick);

            if (EthRegex.IsMatch(inp) || IsBNB(inp))
                return (inp, TransactionDestination.Wallet);


            return (inp, TransactionDestination.Nick);
        }

        public static string NickToView(string inp)
        {
            return string.IsNullOrEmpty(inp) ? string.Empty : inp.Replace("_", @"\_");
        }

        public static string NickToInternal(string inp)
        {
            return string.IsNullOrEmpty(inp) ? string.Empty : inp.Replace(@"\_", "_").Replace("@", "");
        }

        public static string DogView(string inp, bool isDogNeed)
        {
            return isDogNeed ? $"@{NickToView(inp)}" : NickToView(inp);
        }
    }
}