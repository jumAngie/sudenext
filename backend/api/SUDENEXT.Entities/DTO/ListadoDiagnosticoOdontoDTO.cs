using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SUDENEXT.Entities.DTO
{
    public class ListadoDiagnosticoOdontoDTO
    {
        public int trd_ID { get; set; }

        public int? sca_ID { get; set; }

        public string est_NombreCompleto { get; set; }

        public string per_Nombres {  get; set; }

        public int? tra_ID { get; set; }

        public string trd_Descripcion { get; set; }

        public string trd_Diagnostico { get; set; }

        public int trd_Duracion { get; set; }

        public decimal trd_Costo { get; set; }

        public bool? trd_Seguimiento { get; set; }

        public DateTime? trd_FechaSeg { get; set; }

        public string trd_Instrucciones { get; set; }

        public string trd_Observaciones { get; set; }

        public int usu_UsuarioCreacion { get; set; }
        public string Usuario_C { get; set; }
        public int ID_Creador { get; set; }
        public string NombreCompleto_C { get; set; }
        public DateTime trd_FechaCreacion { get; set; }


        public int? usu_UsuarioModificacion { get; set; }
        public string Usuario_M { get; set; }
        public int ID_Modificador { get; set; }
        public string NombreCompleto_M { get; set; }
        public DateTime? trd_FechaModificacion { get; set; }


        public int? usu_UsuarioEliminacion { get; set; }
        public string Usuario_E { get; set; }
        public int ID_Eliminador { get; set; }
        public string NombreCompleto_E { get; set; }
        public DateTime? trd_FechaEliminacion { get; set; }

        public bool? trd_Estado { get; set; }
    }
}
