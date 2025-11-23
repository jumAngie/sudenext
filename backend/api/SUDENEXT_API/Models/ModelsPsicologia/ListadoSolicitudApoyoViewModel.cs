namespace SUDENEXT.API.Models.ModelsPsicologia
{
    public class ListadoSolicitudApoyoViewModel
    {
        public int sol_ID { get; set; }

        public int? est_ID { get; set; }

        public string est_NombreCompleto { get; set; }

        public string sol_MotivoConsulta { get; set; }

        public int? sol_MalestarEmocional { get; set; }

        public bool? sol_Asistencia { get; set; }

        public string sol_HorarioPref { get; set; }
        public bool? sol_Cancelacion { get; set; }

        public int usu_UsuarioCreacion { get; set; }
        public string Usuario_C { get; set; }
        public int ID_Creador { get; set; }
        public string NombreCompleto_C { get; set; }
        public DateTime sol_FechaCreacion { get; set; }


        public int? usu_UsuarioModificacion { get; set; }
        public string Usuario_M { get; set; }
        public int ID_Modificador { get; set; }
        public string NombreCompleto_M { get; set; }
        public DateTime? sol_FechaModificacion { get; set; }


        public int? usu_UsuarioEliminacion { get; set; }
        public string Usuario_E { get; set; }
        public int ID_Eliminador { get; set; }
        public string NombreCompleto_E { get; set; }
        public DateTime? sol_FechaEliminacion { get; set; }

        public bool? sol_Estado { get; set; }
        public bool? sol_Asignada { get; set; }
    }
}
