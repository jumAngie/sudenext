using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SUDENEXT.Entities.DTO
{
    public class EstudiantesLoginResult
    {
        public int codeStatus { get; set; }
        public string messageStatus { get; set; }

        public int? est_ID { get; set; }
        public string est_NumeroCuenta { get; set; }
        public string est_NombreCompleto { get; set; }
        public string est_Contra { get; set; }
        public string est_Correo { get; set; }
        public string est_Celular { get; set; }
        public string est_Carrera { get; set; }
        public bool? est_EstadoM { get; set; }
    }
}
