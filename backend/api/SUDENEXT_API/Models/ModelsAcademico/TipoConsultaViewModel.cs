namespace SUDENEXT.API.Models.ModelsAcademico
{
    public class TipoConsultaViewModel
    {
        public int tic_ID { get; set; }

        public string tic_Descripcion { get; set; }

        public int usu_UsuarioCreacion { get; set; }

        public DateTime tic_FechaCreacion { get; set; }

        public int? usu_UsuarioModificacion { get; set; }

        public DateTime? tic_FechaModificacion { get; set; }

        public int? usu_UsuarioEliminacion { get; set; }

        public DateTime? tic_FechaEliminacion { get; set; }

        public bool? tic_Estado { get; set; }
    }
}
