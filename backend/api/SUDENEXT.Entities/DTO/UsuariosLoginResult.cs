using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SUDENEXT.Entities.DTO
{
    public class UsuariosLoginResult
    {
        public int codeStatus { get; set; }
        public string messageStatus { get; set; }

        public int usu_ID { get; set; }

        public string usu_Usuario { get; set; }

        public int? per_ID { get; set; }

        public int? rol_ID { get; set; }

        public string rol_Descripcion { get; set; }

        public string per_Nombres { get; set; }

        public string per_Apellidos { get; set; }

        public string per_EstadoCivil { get; set; }

        public string per_Sexo { get; set; }

        public DateTime per_FechaNac { get; set; }

        public string per_Telefono { get; set; }

        public string per_Direccion { get; set; }

        public string per_Correo { get; set; }

        public int? are_ID { get; set; }
        public string are_Nombre { get; set; }
    }
}
