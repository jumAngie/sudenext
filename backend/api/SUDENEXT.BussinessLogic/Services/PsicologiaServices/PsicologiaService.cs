using SUDENEXT.DataAccess.Repositories.Psi;
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
        #endregion

        #region Solicitud Apoyo
        #endregion

        #region SolicitudesXPlanes
        #endregion


    }
}
