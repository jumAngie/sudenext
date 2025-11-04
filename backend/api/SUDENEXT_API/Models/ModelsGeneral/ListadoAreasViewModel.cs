namespace SUDENEXT.API.Models.ModelsGeneral
{
    public class ListadoAreasViewModel
    {
        public int are_ID { get; set; }
        public string are_Nombre { get; set; }


        public int usu_UsuarioCreacion { get; set; }
        public string Usuario_C { get; set; }
        public int ID_Creador { get; set; }
        public string NombreCompleto_C { get; set; }
        public DateTime are_FechaCreacion { get; set; }


        public int? usu_UsuarioModificacion { get; set; }
        public string Usuario_M { get; set; }
        public int ID_Modificador { get; set; }
        public string NombreCompleto_M { get; set; }
        public DateTime? are_FechaModificacion { get; set; }

        public int? usu_UsuarioEliminacion { get; set; }
        public string Usuario_E { get; set; }
        public int ID_Eliminador { get; set; }
        public string NombreCompleto_E { get; set; }
        public DateTime? are_FechaEliminacion { get; set; }

        public bool? are_Estado { get; set; }
    }
}
