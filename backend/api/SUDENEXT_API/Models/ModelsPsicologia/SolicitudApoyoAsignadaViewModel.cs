namespace SUDENEXT.API.Models.ModelsPsicologia
{
    public class SolicitudApoyoAsignadaViewModel
    {
        public int spa_ID { get; set; }

        public int? sol_ID { get; set; }

        public int? per_ID { get; set; }

        public bool? spa_Cancel { get; set; }

        public int usu_UsuarioCreacion { get; set; }

        public DateTime spa_FechaCreacion { get; set; }

        public int? usu_UsuarioModificacion { get; set; }

        public DateTime? spa_FechaModificacion { get; set; }

        public int? usu_UsuarioEliminacion { get; set; }

        public DateTime? spa_FechaEliminacion { get; set; }

        public bool? spa_Estado { get; set; }
    }
}
