using SUDENEXT.DataAccess.Repositories.Gral;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SUDENEXT.BussinessLogic.Services.GeneralServices
{
    public class GeneralService
    {
        private readonly AreasRepository _areasRepository;
        private readonly EstudiantesRepository _estudiantesRepository;
        private readonly PersonalRepository _personalRepository;

        public  GeneralService(AreasRepository areasRepository, 
                EstudiantesRepository estudiantesRepository,
                PersonalRepository personalRepository)
        {
            _areasRepository = areasRepository;
            _estudiantesRepository = estudiantesRepository;
            _personalRepository = personalRepository;
        }

        #region Areas
        #endregion

        #region Estudiantes
        #endregion

        #region Personal
        #endregion

    }
}
