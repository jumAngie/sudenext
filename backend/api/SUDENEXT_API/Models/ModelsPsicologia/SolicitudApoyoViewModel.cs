namespace SUDENEXT.API.Models.ModelsPsicologia
{
    public class SolicitudApoyoViewModel
    {
        public int sol_ID { get; set; }

        public int? est_ID { get; set; }

        public string sol_ResumenSesion { get; set; }

        public string sol_MotivoConsulta { get; set; }

        public int? sol_MalestarEmocional { get; set; }

        public bool? sol_Asistencia { get; set; }

        public TimeSpan? sol_HorarioPref { get; set; }

        public int usu_UsuarioCreacion { get; set; }

        public DateTime sol_FechaCreacion { get; set; }

        public int? usu_UsuarioModificacion { get; set; }

        public DateTime? sol_FechaModificacion { get; set; }

        public int? usu_UsuarioEliminacion { get; set; }

        public DateTime? sol_FechaEliminacion { get; set; }

        public bool? sol_Estado { get; set; }
    }
}
