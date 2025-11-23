namespace SUDENEXT.API.Models.ModelsAcceso
{
    public class RolesViewModel
    {
        public int rol_ID { get; set; }

        public string rol_Descripcion { get; set; }

        public int usu_UsuarioCreacion { get; set; }

        public DateTime rol_FechaCreacion { get; set; }

        public int? usu_UsuarioModificacion { get; set; }

        public DateTime? rol_FechaModificacion { get; set; }

        public int? usu_UsuarioEliminacion { get; set; }

        public DateTime? rol_FechaEliminacion { get; set; }

        public bool? rol_Estado { get; set; }
    }
}
