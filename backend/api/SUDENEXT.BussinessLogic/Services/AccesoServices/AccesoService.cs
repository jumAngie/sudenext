using SUDENEXT.DataAccess.Repositories.Acce;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SUDENEXT.BussinessLogic.Services.AccesoServices
{
    public class AccesoService
    {
        private readonly UsuariosRepository _usuariosRepository;
        private readonly RolesRepository _rolesRepository;
        private readonly RolesXPantallasRepository _rolesXPantallasRepository;

        public  AccesoService(UsuariosRepository usuariosRepository, 
                RolesRepository rolesRepository,
                RolesXPantallasRepository rolesXPantallasRepository)
        {
            _usuariosRepository = usuariosRepository;
            _rolesRepository = rolesRepository;
            _rolesXPantallasRepository = rolesXPantallasRepository;
        }

        #region Usuarios
        #endregion

        #region Roles
        #endregion

        #region RolesXPantallas
        #endregion
    }
}
