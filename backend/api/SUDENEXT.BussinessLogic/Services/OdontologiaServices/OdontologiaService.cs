using SUDENEXT.DataAccess.Repositories.Acad;
using SUDENEXT.DataAccess.Repositories.Odon;
using SUDENEXT.Entities.Entities;
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
        public ServiceResult ListadoTipoTratamientoCompleto()
        {
            var resultado = new ServiceResult();

            try
            {
                var list = _tratamientosRepository.ListadoCompleto();
                return resultado.Ok(list);
            }
            catch (Exception ex)
            {
                return resultado.Error(ex.Message);
            }

        }

        public ServiceResult CrearTipoTratamiento(tbTratamientos item)
        {
            var result = new ServiceResult();
            try
            {
                var list = _tratamientosRepository.Insert(item);
                return result.Ok(list);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }

        public ServiceResult EditarTipoTratamiento(tbTratamientos item)
        {

            var result = new ServiceResult();
            try
            {
                var list = _tratamientosRepository.Update(item);
                return result.Ok(list);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }

        }

        public ServiceResult EliminarTipoTratamiento(tbTratamientos item)
        {
            var result = new ServiceResult();
            try
            {
                var list = _tratamientosRepository.Delete(item);
                return result.Ok(list);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }
        #endregion
    }
}
