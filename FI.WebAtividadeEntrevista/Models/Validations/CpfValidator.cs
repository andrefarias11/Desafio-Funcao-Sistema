using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.RegularExpressions;

namespace FI.WebAtividadeEntrevista.Models.Validations
{
    public class CpfValidator : ValidationAttribute
    {
        public override bool IsValid(object value)
        {
            if (value == null)
                return false;

            var cpf = Regex.Replace(value.ToString(), "[^0-9]", "");

            if (cpf.Length != 11 || cpf.Distinct().Count() == 1)
                return false;

            var cpfBase = cpf.Substring(0, 9);
            var cpfDigit = cpf.Substring(9, 2);

            var firstDigit = CalculateCpfDigit(cpfBase, new int[] { 10, 9, 8, 7, 6, 5, 4, 3, 2 });
            var secondDigit = CalculateCpfDigit(cpfBase + firstDigit, new int[] { 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 });

            return cpfDigit == $"{firstDigit}{secondDigit}";
        }

        private static int CalculateCpfDigit(string cpf, int[] weights)
        {
            var sum = cpf.Select((t, i) => int.Parse(t.ToString()) * weights[i]).Sum();
            var remainder = sum % 11;
            return remainder < 2 ? 0 : 11 - remainder;
        }
    }
}
