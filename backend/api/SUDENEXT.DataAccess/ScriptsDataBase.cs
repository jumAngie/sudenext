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

        // Usuarios


        // LogIn
        public static string VerificarUsuario = "";

        #endregion

        #region Acce
        #endregion

        #region Gral
        public static string ListarPersonal = "Gral.sp_ListarPersonal";
        public static string CrearPersonal = "Gral.sp_CrearPersonal";
        public static string EditarPersonal = "Gral.sp_EditarPersonal";
        public static string EliminarPersonal = "Gral.sp_EliminarPersonal";

        public static string ListarAreas = "Gral.sp_ListarAreas";
        public static string CrearAreas = "Gral.sp_CrearArea";
        public static string EditarAreas = "Gral.sp_EditarArea";
        public static string EliminarAreas = "Gral.sp_EliminarArea";
        #endregion

        #region Med
        #endregion

        #region Odon
        #endregion

        #region Psi
        #endregion
    }
}
