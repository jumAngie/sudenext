using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Cryptography;

namespace SUDENEXT.BussinessLogic
{
    public static class PasswordHelpers
    {
        public static string HashPassword(string password)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                StringBuilder builder = new StringBuilder();

                foreach (var b in bytes)
                    builder.Append(b.ToString("X2"));

                return builder.ToString();
            }
        }
    }
}
