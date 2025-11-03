using SUDENEXT.Entities.Entities;

namespace SUDENEXT.API.Models.ModelsGeneral
{
    public class PersonalViewModel
    {
        public int per_ID { get; set; }

        public string per_Nombres { get; set; }

        public string per_Apellidos { get; set; }

        public string per_EstadoCivil { get; set; }

        public string per_Sexo { get; set; }

        public DateTime per_FechaNac { get; set; }

        public string per_Telefono { get; set; }

        public string per_Direccion { get; set; }

        public string per_Correo { get; set; }

        public int? are_ID { get; set; }

        public int usu_UsuarioCreacion { get; set; }

        public DateTime per_FechaCreacion { get; set; }

        public int? usu_UsuarioModificacion { get; set; }

        public DateTime? per_FechaModificacion { get; set; }

        public int? usu_UsuarioEliminacion { get; set; }

        public DateTime? per_FechaEliminacion { get; set; }

        public bool? per_Estado { get; set; }
    }
}
