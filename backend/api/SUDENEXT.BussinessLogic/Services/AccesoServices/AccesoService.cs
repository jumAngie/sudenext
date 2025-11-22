using SUDENEXT.DataAccess.Repositories.Acce;
using SUDENEXT.DataAccess.Repositories.Gral;
using SUDENEXT.Entities.Entities;
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
        public ServiceResult UsuariosLogin(tbUsuarios item)
        {
            var resultado = new ServiceResult();

            try
            {
                var usuario = _usuariosRepository.Login(item);

                if (usuario.codeStatus == 0)
                {
                    return resultado.Forbidden(usuario.messageStatus);
                }

                return resultado.Ok(usuario);
            }
            catch (Exception ex)
            {
                return resultado.Error(ex.Message);
            }
        }
        #endregion

        #region Roles
        #endregion

        #region RolesXPantallas
        #endregion
    }
}
