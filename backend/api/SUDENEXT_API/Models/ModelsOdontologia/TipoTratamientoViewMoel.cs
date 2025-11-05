namespace SUDENEXT.API.Models.ModelsOdontologia
{
    public class TipoTratamientoViewMoel
    {
        public int tra_ID { get; set; }

        public string tra_Descripcion { get; set; }

        public int usu_UsuarioCreacion { get; set; }

        public DateTime tra_FechaCreacion { get; set; }

        public int? usu_UsuarioModificacion { get; set; }

        public DateTime? tra_FechaModificacion { get; set; }

        public int? usu_UsuarioEliminacion { get; set; }

        public DateTime? tra_FechaEliminacion { get; set; }

        public bool? tra_Estado { get; set; }

    }
}
