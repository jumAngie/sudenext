namespace SUDENEXT.API.Models.ModelsGeneral
{
    public class AreasViewModel
    {
        public int are_ID { get; set; }

        public string are_Nombre { get; set; }

        public int usu_UsuarioCreacion { get; set; }

        public DateTime are_FechaCreacion { get; set; }

        public int? usu_UsuarioModificacion { get; set; }

        public DateTime? are_FechaModificacion { get; set; }

        public int? usu_UsuarioEliminacion { get; set; }

        public DateTime? are_FechaEliminacion { get; set; }

        public bool? are_Estado { get; set; }
    }
}
