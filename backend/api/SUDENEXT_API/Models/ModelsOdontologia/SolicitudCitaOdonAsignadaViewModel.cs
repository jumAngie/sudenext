namespace SUDENEXT.API.Models.ModelsOdontologia
{
    public class SolicitudCitaOdonAsignadaViewModel
    {
        public int sca_ID { get; set; }

        public int? sco_ID { get; set; }

        public int? per_ID { get; set; }

        public bool? sca_Cancel { get; set; }

        public int usu_UsuarioCreacion { get; set; }

        public DateTime sca_FechaCreacion { get; set; }

        public int? usu_UsuarioModificacion { get; set; }

        public DateTime? sca_FechaModificacion { get; set; }

        public int? usu_UsuarioEliminacion { get; set; }

        public DateTime? sca_FechaEliminacion { get; set; }

        public bool? sca_Estado { get; set; }
    }
}
