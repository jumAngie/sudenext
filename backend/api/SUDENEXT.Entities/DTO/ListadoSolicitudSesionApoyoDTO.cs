using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SUDENEXT.Entities.DTO
{
    public class ListadoSolicitudSesionApoyoDTO
    {
        public int sol_ID { get; set; }

        public int? est_ID { get; set; }

        public string est_NombreCompleto { get; set; }

        public string sol_ResumenSesion { get; set; }

        public string sol_MotivoConsulta { get; set; }

        public int? sol_MalestarEmocional { get; set; }

        public bool? sol_Asistencia { get; set; }

        public TimeSpan? sol_HorarioPref { get; set; }
        public bool? sol_Cancelacion { get; set; }

        public DateTime? sol_FechaCancelacion { get; set; }

        public DateTime sol_FechaCreacion { get; set; }

        public DateTime? sol_FechaModificacion { get; set; }
       
        public DateTime? sol_FechaEliminacion { get; set; }

        public bool? sol_Estado { get; set; }
    }
}
