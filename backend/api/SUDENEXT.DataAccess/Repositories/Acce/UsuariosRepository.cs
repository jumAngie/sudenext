using Dapper;
using Microsoft.Data.SqlClient;
using SUDENEXT.Entities.DTO;
using SUDENEXT.Entities.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SUDENEXT.DataAccess.Repositories.Acce
{
    public class UsuariosRepository : IRepository<tbRolesXPantallas>
    {
        public UsuariosLoginResult Login(tbUsuarios item)
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            var parametros = new DynamicParameters();
            parametros.Add("@usu_Usuario", item.usu_Usuario, DbType.String, ParameterDirection.Input);
            parametros.Add("@usu_Contrasena", item.usu_Contrasena, DbType.String, ParameterDirection.Input);

            var resultado = db.QueryFirst<UsuariosLoginResult>(ScriptsDataBase.UsuariosLogin, parametros, commandType: CommandType.StoredProcedure);
            return resultado;
        }

        public RequestStatus Delete(tbRolesXPantallas item)
        {
            throw new NotImplementedException();
        }

        public tbRolesXPantallas Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbRolesXPantallas item)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<tbRolesXPantallas> List()
        {
            throw new NotImplementedException();
        }

        public RequestStatus Update(tbRolesXPantallas item)
        {
            throw new NotImplementedException();
        }
    }
}
