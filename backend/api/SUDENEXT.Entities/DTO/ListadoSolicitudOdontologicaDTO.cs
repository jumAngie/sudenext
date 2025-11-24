using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SUDENEXT.Entities.DTO
{
    public class ListadoSolicitudOdontologicaDTO
    {
        public int sco_ID { get; set; }

        public int? est_ID { get; set; }

        public string est_NombreCompleto { get; set; }
        public string est_NumeroCuenta { get; set; }

        public DateTime sco_FechaP { get; set; }

        public string sco_Hora { get; set; }

        public string sco_Motivo { get; set; }

        public string sco_Prioridad { get; set; }

        public bool? sco_Cancelar { get; set; }

        public DateTime? sco_FechaCancelacion { get; set; }

        public DateTime sco_FechaCreacion { get; set; }

        public DateTime? sco_FechaModificacion { get; set; }

        public DateTime? sco_FechaEliminacion { get; set; }

        public bool? sco_Estado { get; set; }

        public bool? sco_Asignada { get; set; }
        public int? per_ID { get; set; }
        public string? per_Nombres { get; set; }
    }
}
