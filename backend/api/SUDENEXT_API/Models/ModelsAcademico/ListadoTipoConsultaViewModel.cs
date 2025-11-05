namespace SUDENEXT.API.Models.ModelsAcademico
{
    public class ListadoTipoConsultaViewModel
    {
        public int tic_ID { get; set; }

        public string tic_Descripcion { get; set; }


        public int usu_UsuarioCreacion { get; set; }
        public string Usuario_C { get; set; }
        public int ID_Creador { get; set; }
        public string NombreCompleto_C { get; set; }
        public DateTime tic_FechaCreacion { get; set; }


        public int? usu_UsuarioModificacion { get; set; }
        public string Usuario_M { get; set; }
        public int ID_Modificador { get; set; }
        public string NombreCompleto_M { get; set; }
        public DateTime? tic_FechaModificacion { get; set; }


        public int? usu_UsuarioEliminacion { get; set; }
        public string Usuario_E { get; set; }
        public int ID_Eliminador { get; set; }
        public string NombreCompleto_E { get; set; }
        public DateTime? tic_FechaEliminacion { get; set; }

        public bool? tic_Estado { get; set; }
    }
}
