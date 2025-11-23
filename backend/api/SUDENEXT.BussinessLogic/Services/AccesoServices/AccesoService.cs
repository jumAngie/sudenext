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

        public ServiceResult ListadoUsuariosCompleto()
        {

            var resultado = new ServiceResult();

            try
            {
                var list = _usuariosRepository.ListadoCompleto();
                return resultado.Ok(list);
            }
            catch (Exception ex)
            {
                return resultado.Error(ex.Message);
            }

        }

        public ServiceResult CrearUsuario(tbUsuarios item)
        {
            var result = new ServiceResult();
            try
            {
                var list = _usuariosRepository.Insert(item);
                return result.Ok(list);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }

        public ServiceResult EditarUsuario(tbUsuarios item)
        {

            var result = new ServiceResult();
            try
            {
                var list = _usuariosRepository.Update(item);
                return result.Ok(list);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }

        }

        public ServiceResult EliminarUsuario(tbUsuarios item)
        {
            var result = new ServiceResult();
            try
            {
                var list = _usuariosRepository.Delete(item);
                return result.Ok(list);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }

        public ServiceResult CambiarContrasenia(tbUsuarios item)
        {

            var result = new ServiceResult();
            try
            {
                var list = _usuariosRepository.CambiarContrasenia(item);
                return result.Ok(list);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }

        }
        #endregion

        #region Roles
        public ServiceResult ListadoRolesCompleto()
        {

            var resultado = new ServiceResult();

            try
            {
                var list = _rolesRepository.ListadoCompleto();
                return resultado.Ok(list);
            }
            catch (Exception ex)
            {
                return resultado.Error(ex.Message);
            }

        }

        public ServiceResult CrearRol(tbRoles item)
        {
            var result = new ServiceResult();
            try
            {
                var list = _rolesRepository.Insert(item);
                return result.Ok(list);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }

        public ServiceResult EditarRol(tbRoles item)
        {

            var result = new ServiceResult();
            try
            {
                var list = _rolesRepository.Update(item);
                return result.Ok(list);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }

        }

        public ServiceResult EliminarRoles(tbRoles item)
        {
            var result = new ServiceResult();
            try
            {
                var list = _rolesRepository.Delete(item);
                return result.Ok(list);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }
        #endregion

        #region RolesXPantallas
        #endregion
    }
}
