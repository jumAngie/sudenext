using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SUDENEXT.Entities.DTO
{
    public class ListadoConsultasAcademicasDTO
    {
        public int coa_ID { get; set; }

        public int? est_ID { get; set; }

        public string est_NombreCompleto { get; set; }

        public int? tic_ID { get; set; }

        public string tic_Descripcion { get; set; }

        public string coa_Descripcion { get; set; }

        public string coa_Recomendacion { get; set; }

        public bool? coa_Seguimiento { get; set; }

        public string Seguimiento { get; set; }

        
        public int usu_UsuarioCreacion { get; set; }
        public string Usuario_C { get; set; }
        public int ID_Creador { get; set; }
        public string NombreCompleto_C { get; set; }
        public DateTime coa_FechaCreacion { get; set; }

        public int? usu_UsuarioModificacion { get; set; }
        public string Usuario_M { get; set; }
        public int ID_Modificador { get; set; }
        public string NombreCompleto_M { get; set; }
        public DateTime? coa_FechaModificacion { get; set; }

        public int? usu_UsuarioEliminacion { get; set; }
        public string Usuario_E { get; set; }
        public int ID_Eliminador { get; set; }
        public string NombreCompleto_E { get; set; }
        public DateTime? coa_FechaEliminacion { get; set; }

        public bool? coa_Estado { get; set; }
    }
}
