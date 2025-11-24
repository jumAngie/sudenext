using System.ComponentModel.DataAnnotations.Schema;

namespace SUDENEXT.API.Models.ModelsPsicologia
{
    public class PlanAccionViewModel
    {
        public int pla_ID { get; set; }

        public string pla_ResumenSesion { get; set; }

        public string pla_Objetivo { get; set; }

        public string pla_ActividadSug { get; set; }

        public DateTime? pla_FechaSeguimiento { get; set; }

        public string pla_Observacion { get; set; }

        public int usu_UsuarioCreacion { get; set; }

        public DateTime pla_FechaCreacion { get; set; }

        public int? usu_UsuarioModificacion { get; set; }

        public DateTime? pla_FechaModificacion { get; set; }

        public int? usu_UsuarioEliminacion { get; set; }

        public DateTime? pla_FechaEliminacion { get; set; }

        public bool? pla_Estado { get; set; }
        [NotMapped]
        public int spa_Id { get; set; }
    }
}
