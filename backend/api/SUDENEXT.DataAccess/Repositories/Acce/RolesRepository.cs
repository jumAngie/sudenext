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
    public class RolesRepository : IRepository<tbRoles>
    {
        public RequestStatus Delete(tbRoles item)
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            RequestStatus result = new RequestStatus();
            var parametros = new DynamicParameters();
            parametros.Add("@rol_ID", item.rol_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@usu_UsuarioEliminacion", item.usu_UsuarioEliminacion, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@rol_FechaEliminacion", item.rol_FechaEliminacion, DbType.DateTime, ParameterDirection.Input);
            var answer = db.QueryFirst<string>(ScriptsDataBase.EliminarRol, parametros, commandType: CommandType.StoredProcedure);
            result.MessageStatus = answer;
            return result;
        }

        public tbRoles Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbRoles item)
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            RequestStatus result = new RequestStatus();
            var parametros = new DynamicParameters();
            parametros.Add("@rol_Descripcion", item.rol_Descripcion, DbType.String, ParameterDirection.Input);
            parametros.Add("@usu_UsuarioCreacion", item.usu_UsuarioCreacion, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@rol_FechaCreacion", item.rol_FechaCreacion, DbType.DateTime, ParameterDirection.Input);
            var answer = db.QueryFirst<string>(ScriptsDataBase.CrearRol, parametros, commandType: CommandType.StoredProcedure);
            result.MessageStatus = answer;
            return result;
        }

        public IEnumerable<tbRoles> List()
        {
            throw new NotImplementedException();
        }
        public IEnumerable<ListadoRolesDTO> ListadoCompleto()
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            var parametros = new DynamicParameters();
            return db.Query<ListadoRolesDTO>(ScriptsDataBase.ListarRol, null, commandType: CommandType.StoredProcedure);
        }


        public RequestStatus Update(tbRoles item)
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            RequestStatus result = new RequestStatus();
            var parametros = new DynamicParameters();
            parametros.Add("@rol_ID", item.rol_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@rol_Descripcion", item.rol_Descripcion, DbType.String, ParameterDirection.Input);
            parametros.Add("@usu_UsuarioModificacion", item.usu_UsuarioModificacion, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@rol_FechaModificacion", item.rol_FechaModificacion, DbType.DateTime, ParameterDirection.Input);
            var answer = db.QueryFirst<string>(ScriptsDataBase.EditarRol, parametros, commandType: CommandType.StoredProcedure);
            result.MessageStatus = answer;
            return result;
        }
    }
}
