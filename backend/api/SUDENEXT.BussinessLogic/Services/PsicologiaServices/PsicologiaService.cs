using SUDENEXT.DataAccess.Repositories.Acad;
using SUDENEXT.DataAccess.Repositories.Psi;
using SUDENEXT.Entities.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SUDENEXT.BussinessLogic.Services.PsicologiaServices
{
    public class PsicologiaService
    {
        private readonly PlanAccionRepository _planAccionRepository;
        private readonly SolicitudApoyoRepository _solicitudApoyoRepository;
        private readonly SolicitudesXPlanesRepository _solicitudesXPlanesRepository;

        public PsicologiaService(PlanAccionRepository planAccionRepository,
                                 SolicitudApoyoRepository solicitudApoyoRepository,
                                 SolicitudesXPlanesRepository solicitudesXPlanesRepository)
        {
            _planAccionRepository = planAccionRepository;
            _solicitudApoyoRepository = solicitudApoyoRepository;
            _solicitudesXPlanesRepository = solicitudesXPlanesRepository;
        }


        #region Plan de Acción
        public ServiceResult ListadoPlanAccionCompleto()
        {
            var resultado = new ServiceResult();

            try
            {
                var list = _planAccionRepository.ListadoCompleto();
                return resultado.Ok(list);
            }
            catch (Exception ex)
            {
                return resultado.Error(ex.Message);
            }

        }

        public ServiceResult CrearPlanAccion(tbPlanAccion item)
        {
            var result = new ServiceResult();
            try
            {
                var list = _planAccionRepository.Insert(item);
                return result.Ok(list);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }

        public ServiceResult EditarPlanAccion(tbPlanAccion item)
        {

            var result = new ServiceResult();
            try
            {
                var list = _planAccionRepository.Update(item);
                return result.Ok(list);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }

        }

        public ServiceResult EliminarPlanAccion(tbPlanAccion item)
        {
            var result = new ServiceResult();
            try
            {
                var list = _planAccionRepository.Delete(item);
                return result.Ok(list);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }
        #endregion

        #region Solicitud Apoyo
        public ServiceResult ListadoSolicitudApoyoCompleto()
        {
            var resultado = new ServiceResult();

            try
            {
                var list = _solicitudApoyoRepository.ListadoCompleto();
                return resultado.Ok(list);
            }
            catch (Exception ex)
            {
                return resultado.Error(ex.Message);
            }

        }

        public ServiceResult ListadoSolicitudApoyoEstudiante(tbSolicitudApoyo item)
        {
            var resultado = new ServiceResult();

            try
            {
                var list = _solicitudApoyoRepository.ListadoTOP5Estudiante(item);
                return resultado.Ok(list);
            }
            catch (Exception ex)
            {
                return resultado.Error(ex.Message);
            }

        }

        public ServiceResult CrearSolicitudApoyo(tbSolicitudApoyo item)
        {
            var result = new ServiceResult();
            try
            {
                var list = _solicitudApoyoRepository.Insert(item);
                return result.Ok(list);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }

        public ServiceResult EditarSolicitudApoyo(tbSolicitudApoyo item)
        {

            var result = new ServiceResult();
            try
            {
                var list = _solicitudApoyoRepository.Update(item);
                return result.Ok(list);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }

        }

        public ServiceResult EliminarSolicitudApoyo(tbSolicitudApoyo item)
        {
            var result = new ServiceResult();
            try
            {
                var list = _solicitudApoyoRepository.Delete(item);
                return result.Ok(list);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }
        #endregion

        #region SolicitudesXPlanes
        #endregion


    }
}
