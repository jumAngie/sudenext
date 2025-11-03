using SUDENEXT.DataAccess.Repositories.Odon;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SUDENEXT.BussinessLogic.Services.OdontologiaServices
{
    public class OdontologiaService
    {
        private readonly DiagnosticoOdonRepository _diagnosticoOdonRepository;
        private readonly SolicitudCitaOdonRepository _solicitudCitaOdonRepository;
        private readonly TratamientosRepository _tratamientosRepository;

        public  OdontologiaService(DiagnosticoOdonRepository diagnosticoOdonRepository,
                SolicitudCitaOdonRepository solicitudCitaOdonRepository,
                TratamientosRepository tratamientosRepository)
        {
            _diagnosticoOdonRepository = diagnosticoOdonRepository;
            _solicitudCitaOdonRepository = solicitudCitaOdonRepository;
            _tratamientosRepository = tratamientosRepository;
        }

        #region Diagnostico Odon
        #endregion

        #region Solicitud Odon
        #endregion

        #region Tratamientos
        #endregion
    }
}
