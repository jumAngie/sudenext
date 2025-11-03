using SUDENEXT.DataAccess.Repositories.Acad;
using SUDENEXT.DataAccess.Repositories.Acce;
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
        #endregion

        #region Tipo Consulta
        #endregion
    }
}
