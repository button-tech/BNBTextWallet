namespace Discord.Bot.DTO
{
    using System;

    public static class DecimalEx
    {
        private const decimal E = 2.7182818284590452353602874714m;

        public static decimal Pow(this decimal x, decimal power)
        {
            return PowEx(x, power);
        }

        public static decimal PowEx(decimal x, decimal y)
        {
            decimal result;
            var isNegativeExponent = false;

            if (y < 0)
            {
                isNegativeExponent = true;
                y = Math.Abs(y);
            }

            switch (y)
            {
                case 0:
                    result = 1;
                    break;
                case 1:
                    result = x;
                    break;
                default:
                {
                    var t = decimal.Truncate(y);

                    if (y == t)
                        result = ExpBySquaring(x, y);
                    else
                        result = ExpBySquaring(x, t) * Exp((y - t) * Log(x));

                    break;
                }
            }

            if (!isNegativeExponent) return result;
            if (result == 0) throw new OverflowException("Negative power of 0 is undefined!");

            result = 1 / result;

            return result;
        }

        private static decimal ExpBySquaring(decimal x, decimal y)
        {
            if (y < 0) throw new ArgumentOutOfRangeException("y", "Negative exponents not supported!");
            if (decimal.Truncate(y) != y) throw new ArgumentException("Exponent must be an integer!", "y");

            var result = 1m;
            var multiplier = x;

            while (y > 0)
            {
                if (y % 2 == 1)
                {
                    result *= multiplier;
                    y -= 1;
                    if (y == 0) break;
                }

                multiplier *= multiplier;
                y /= 2;
            }

            return result;
        }

        public static decimal Exp(decimal d)
        {
            decimal result;

            var reciprocal = d < 0;
            d = Math.Abs(d);

            var t = decimal.Truncate(d);

            switch (d)
            {
                case 0:
                    result = 1;
                    break;
                case 1:
                    result = E;
                    break;
                default:
                {
                    if (Math.Abs(d) > 1 && t != d)
                    {
                        result = Exp(t) * Exp(d - t);
                    }
                    else if (d == t)
                    {
                        result = ExpBySquaring(E, d);
                    }
                    else
                    {
                        var iteration = 0;
                        decimal nextAdd = 0;
                        result = 0;

                        while (true)
                        {
                            if (iteration == 0)
                                nextAdd = 1;
                            else
                                nextAdd *= d / iteration;

                            if (nextAdd == 0) break;

                            result += nextAdd;

                            iteration += 1;
                        }
                    }

                    break;
                }
            }

            if (reciprocal) result = 1 / result;

            return result;
        }

        public static decimal Log(decimal d)
        {
            if (d < 0)
                throw new ArgumentException("Natural logarithm is a complex number for values less than zero!", "d");
            if (d == 0)
                throw new OverflowException(
                    "Natural logarithm is defined as negative infinitiy at zero which the Decimal data type can't represent!");

            if (d == 1) return 0;

            if (d >= 1)
            {
                const decimal ln10 = 2.3025850929940456840179914547m;
                var power = 0m;

                var x = d;
                while (x > 1)
                {
                    x /= 10;
                    power += 1;
                }

                return Log(x) + power * ln10;
            }

            var iteration = 0;
            var exponent = 0m;
            var result = 0m;

            var y = (d - 1) / (d + 1);
            var ySquared = y * y;

            while (true)
            {
                if (iteration == 0)
                    exponent = 2 * y;
                else
                    exponent = exponent * ySquared;

                var nextAdd = exponent / (2 * iteration + 1);

                if (nextAdd == 0) break;

                result += nextAdd;

                iteration += 1;
            }

            return result;
        }
    }
}