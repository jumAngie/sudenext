namespace SUDENEXT.API.Models.ModelsOdontologia
{
    public class SolicitudCitaOdonViewModel
    {
        public int sco_ID { get; set; }

        public int? est_ID { get; set; }

        public DateTime? sco_FechaP { get; set; }

        public string? sco_Hora { get; set; }

        public string? sco_Motivo { get; set; }

        public string? sco_Prioridad { get; set; }

        public bool? sco_Cancelar { get; set; }

        public DateTime? sco_FechaCancelacion { get; set; }

        public DateTime sco_FechaCreacion { get; set; }

        public DateTime? sco_FechaModificacion { get; set; }

        public DateTime? sco_FechaEliminacion { get; set; }

        public bool? sco_Estado { get; set; }

        public bool? sco_Asignada { get; set; }
    }
}
