using SUDENEXT.DataAccess.Repositories.Acad;
using SUDENEXT.DataAccess.Repositories.Acce;
using SUDENEXT.DataAccess.Repositories.Gral;
using SUDENEXT.Entities.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SUDENEXT.BussinessLogic.Services.AcademicoServices
{
    public class AcademicoService
    {
        private readonly ConsultasAcademicasRepository _consultasAcademicasRepository;
        private readonly TipoConsultaRepository _tipoConsultaRepository;

        public  AcademicoService(ConsultasAcademicasRepository consultasAcademicasRepository,
                TipoConsultaRepository tipoConsultaRepository)
        {
            _consultasAcademicasRepository = consultasAcademicasRepository;
            _tipoConsultaRepository = tipoConsultaRepository;
        }

        #region Consultas Academicas
        public ServiceResult ListadoConsultasAcademicasCompleto()
        {
            var resultado = new ServiceResult();

            try
            {
                var list = _consultasAcademicasRepository.ListadoCompleto();
                return resultado.Ok(list);
            }
            catch (Exception ex)
            {
                return resultado.Error(ex.Message);
            }

        }

        public ServiceResult CrearConsultaAcademicas(tbConsultasAcademicas item)
        {
            var result = new ServiceResult();
            try
            {
                var list = _consultasAcademicasRepository.Insert(item);
                return result.Ok(list);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }

        public ServiceResult EditarConsultaAcademicas(tbConsultasAcademicas item)
        {

            var result = new ServiceResult();
            try
            {
                var list = _consultasAcademicasRepository.Update(item);
                return result.Ok(list);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }

        }

        public ServiceResult EliminarConsultaAcademicas(tbConsultasAcademicas item)
        {
            var result = new ServiceResult();
            try
            {
                var list = _consultasAcademicasRepository.Delete(item);
                return result.Ok(list);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }
        #endregion

        #region Tipo Consulta
        public ServiceResult ListadoTipoConsultaCompleto()
        {
            var resultado = new ServiceResult();

            try
            {
                var list = _tipoConsultaRepository.ListadoCompleto();
                return resultado.Ok(list);
            }
            catch (Exception ex)
            {
                return resultado.Error(ex.Message);
            }

        }

        public ServiceResult CrearTipoConsulta(tbTipoConsulta item)
        {
            var result = new ServiceResult();
            try
            {
                var list = _tipoConsultaRepository.Insert(item);
                return result.Ok(list);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }

        public ServiceResult EditarTipoConsulta(tbTipoConsulta item)
        {

            var result = new ServiceResult();
            try
            {
                var list = _tipoConsultaRepository.Update(item);
                return result.Ok(list);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }

        }

        public ServiceResult EliminarTipoConsulta(tbTipoConsulta item)
        {
            var result = new ServiceResult();
            try
            {
                var list = _tipoConsultaRepository.Delete(item);
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
