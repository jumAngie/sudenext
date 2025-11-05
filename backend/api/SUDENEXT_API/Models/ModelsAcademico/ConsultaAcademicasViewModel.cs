namespace SUDENEXT.API.Models.ModelsAcademico
{
    public class ConsultaAcademicasViewModel
    {
        public int coa_ID { get; set; }

        public int? est_ID { get; set; }

        public int? tic_ID { get; set; }

        public string coa_Descripcion { get; set; }

        public string coa_Recomendacion { get; set; }

        public bool? coa_Seguimiento { get; set; }

        public int usu_UsuarioCreacion { get; set; }

        public DateTime coa_FechaCreacion { get; set; }

        public int? usu_UsuarioModificacion { get; set; }

        public DateTime? coa_FechaModificacion { get; set; }

        public int? usu_UsuarioEliminacion { get; set; }

        public DateTime? coa_FechaEliminacion { get; set; }

        public bool? coa_Estado { get; set; }
    }
}
