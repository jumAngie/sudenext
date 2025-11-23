namespace SUDENEXT.API.Models.ModelsAcceso
{
    public class UsuariosViewModel
    {
        public int usu_ID { get; set; }

        public string usu_Usuario { get; set; }

        public string usu_Contrasena { get; set; }

        public int? per_ID { get; set; }

        public int? rol_ID { get; set; }

        public int usu_UsuarioCreacion { get; set; }

        public DateTime usu_FechaCreacion { get; set; }

        public int? usu_UsuarioModificacion { get; set; }

        public DateTime? usu_FechaModificacion { get; set; }

        public int? usu_UsuarioEliminacion { get; set; }

        public DateTime? usu_FechaEliminacion { get; set; }

        public bool? usu_Estado { get; set; }
    }
}
