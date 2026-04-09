using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SUDENEXT.DataAccess
{
    public class ScriptsDataBase
    {
        #region Acad
        public static string ListarConsultaAcademicas =     "Acad.sp_ListarConsultaAcademicas";
        public static string CrearConsultaAcademicas =      "Acad.sp_CrearConsultaAcademicas";
        public static string EditarConsultaAcademicas =     "Acad.sp_EditarConsultaAcademicas";
        public static string EliminarConsultaAcademicas =   "Acad.sp_EliminarConsultaAcademicas";

        public static string ListarTipoConsulta = "Acad.sp_ListarTipoConsulta";
        public static string CrearTipoConsulta = "Acad.sp_CrearTipoConsulta";
        public static string EditarTipoConsulta = "Acad.sp_EditarTipoConsulta";
        public static string EliminarTipoConsulta = "Acad.sp_EliminarTipoConsulta";
        #endregion

        #region Acce
        public static string UsuariosLogin = "Acce.sp_UsuariosLogin";
        
        public static string ListarUsuarios = "Acce.sp_ListarUsuarios";
        public static string CrearUsuarios = "Acce.sp_CrearUsuario";
        public static string EditarUsuarios = "Acce.sp_EditarUsuario";
        public static string EliminarUsuarios = "Acce.sp_DesactivarUsuario";

        public static string CambiarContrasenia = "Acce.sp_CambiarContrasenia";

        public static string ListarRol = "Acce.sp_ListarRoles";
        public static string CrearRol = "Acce.sp_CrearRol";
        public static string EditarRol = "Acce.sp_EditarRol";
        public static string EliminarRol = "Acce.sp_EliminarRol";
        #endregion

        #region Gral
        public static string DDL_Consejeros = "Gral.sp_DDLConsejeros";
        public static string DDL_Odontologo = "Gral.sp_DDLOdontologos";
        public static string DDL_Asesor = "Gral.sp_DDLAsesor";
        public static string DDL_Medico = "Gral.sp_DDLMedicos";

        public static string ListarPersonal = "Gral.sp_ListarPersonal";
        public static string CrearPersonal = "Gral.sp_CrearPersonal";
        public static string EditarPersonal = "Gral.sp_EditarPersonal";
        public static string EliminarPersonal = "Gral.sp_EliminarPersonal";
        public static string DDL_ListarPersonal_SinUsuario = "Gral.sp_DDLPersonalSinUsuario";

        public static string ListarAreas = "Gral.sp_ListarAreas";
        public static string CrearAreas = "Gral.sp_CrearArea";
        public static string EditarAreas = "Gral.sp_EditarArea";
        public static string EliminarAreas = "Gral.sp_EliminarArea";

        public static string EstudiantesLogin = "Gral.sp_EstudiantesLogin";
        #endregion

        #region Med
        public static string ListarDiagnosticosMed = "Med.sp_ListarDiagnosticosMed";
        public static string CrearDiagnosticosMed = "Med.sp_CrearDiagnosticosMed";
        public static string EditarDiagnosticosMed = "Med.sp_EditarDiagnosticosMed";
        public static string EliminarDiagnosticosMed = "Med.sp_EliminarDiagnosticosMed";
        #endregion


        #region Odon
        public static string ListarTipoTratamiento =    "Odon.sp_ListarTipoTratamiento";
        public static string CrearTipoTratamiento =     "Odon.sp_CrearTipoTratamiento";
        public static string EditarTipoTratamiento =    "Odon.sp_EditarTipoTratamiento";
        public static string EliminarTipoTratamiento =  "Odon.sp_EliminarTipoTratamiento";

        public static string ListarSolicitudCitaOdon = "Odon.sp_ListarSolicitudCitaOdon";
        public static string CrearSolicitudCitaOdon = "Odon.sp_CrearCitaOdon";
        public static string EditarSolicitudCitaOdon = "Odon.sp_EditarCitaOdon";
        public static string EliminarSolicitudCitaOdon = "Odon.sp_EliminarCitaOdon";

        public static string CrearSolicitudOdonAsignada = "Odon.sp_CrearSolicitudOdonAsignada";
        public static string EditarSolicitudOdonAsignada = "Odon.sp_EditarSolicitudOdonAsignada";
        public static string EliminarSolicitudOdonAsignada = "Odon.sp_EliminarSolicitudOdonAsignada";

        public static string ListarDiagnosticoOdon = "Odon.sp_ListarDiagnosticoOdon";
        public static string CrearDiagnosticoOdon = "Odon.sp_CrearDiagnosticoOdon";
        public static string EditarDiagnosticoOdon = "Odon.sp_EditarDiagnosticoOdon";
        public static string EliminarDiagnosticoOdon = "Odon.sp_EliminarDiagnosticoOdon";
        #endregion

        #region Psi
        public static string ListarPlanAccion = "Psi.sp_ListarPlanAccion";
        public static string CrearPlanAccion = "Psi.sp_CrearPlanAccion";
        public static string EditarPlanAccion = "Psi.sp_EditarPlanAccion";
        public static string EliminarPlanAccion = "Psi.sp_EliminarPlanAccion";

        public static string ListarSolicitudApoyo = "Psi.sp_ListarSolicitudApoyo";
        public static string CrearSolicitudApoyo = "Psi.sp_CrearSolicitudApoyo";
        public static string EditarSolicitudApoyo = "Psi.sp_EditarSolicitudApoyo";
        public static string EliminarSolicitudApoyo = "Psi.sp_EliminarSolicitudApoyo";

        public static string ListarSolicitudApoyoEstudiante = "Psi.sp_ListarSolicitudApoyo_Estudiante";

        public static string CrearSolicitudApoyoAsignada = "Psi.sp_CrearSolicitudApoyoAsignada";
        public static string EditarSolicitudApoyoAsignada = "Psi.sp_EditarSolicitudApoyoAsignada";
        public static string EliminarSolicitudApoyoAsignada = "Psi.sp_EliminarSolicitudApoyoAsignada";

        public static string CrearSolicitudesXPlanes = "Psi.sp_CrearSolicitudesXPlanes";
        public static string EditarSolicitudesXPlanes = "Psi.sp_EditarSolicitudesXPlanes";
        public static string EliminarSolicitudesXPlanes = "Psi.sp_EliminarSolicitudesXPlanes";
        #endregion
    }
}
