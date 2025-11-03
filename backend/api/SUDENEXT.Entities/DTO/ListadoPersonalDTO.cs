using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SUDENEXT.Entities.DTO
{
    public class ListadoPersonalDTO
    {
        public int per_ID { get; set; }
        public string per_Nombres { get; set; }
        public string per_Apellidos { get; set; }
        public string EstadoCivil { get; set; }
        public string per_EstadoCivil { get; set; }
        public string Sexo { get; set; }
        public string per_Sexo { get; set; }
        public DateTime per_FechaNac { get; set; }
        public string per_Telefono { get; set; }
        public string per_Direccion { get; set; }
        public string per_Correo { get; set; }
        public int? are_ID { get; set; }
        public string are_Nombre { get; set; }

        public int usu_UsuarioCreacion { get; set; }
        public string Usuario_C { get; set; }
        public int ID_Creador { get; set; }
        public string NombreCompleto_C { get; set; }
        public DateTime per_FechaCreacion { get; set; }

        public int? usu_UsuarioModificacion { get; set; }
        public string Usuario_M { get; set; }
        public int ID_Modificador { get; set; }
        public string NombreCompleto_M { get; set; }
        public DateTime? per_FechaModificacion { get; set; }

        public int? usu_UsuarioEliminacion { get; set; }
        public string Usuario_E { get; set; }
        public int ID_Eliminador { get; set; }
        public string NombreCompleto_E { get; set; }
        public DateTime? per_FechaEliminacion { get; set; }
        public bool? per_Estado { get; set; }
    }
}
