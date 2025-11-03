using SUDENEXT.DataAccess.Repositories.Med;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SUDENEXT.BussinessLogic.Services.MedicinaServices
{
    public class MedicinaService
    {
        private readonly DiagnosticosMedicosRepository _diagnosticoMedicosrepository;

        public MedicinaService(DiagnosticosMedicosRepository diagnosticosMedicosRepository)
        {
            _diagnosticoMedicosrepository = diagnosticosMedicosRepository;
        }

        #region Diagnostico Medico
        #endregion
    }
}
