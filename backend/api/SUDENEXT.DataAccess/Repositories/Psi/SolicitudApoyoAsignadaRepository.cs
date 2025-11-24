using Dapper;
using Microsoft.Data.SqlClient;
using SUDENEXT.Entities.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SUDENEXT.DataAccess.Repositories.Psi
{
    public class SolicitudApoyoAsignadaRepository : IRepository<tbSolicitudApoyoAsignada>
    {
        public RequestStatus Delete(tbSolicitudApoyoAsignada item)
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            RequestStatus result = new RequestStatus();
            var parametros = new DynamicParameters();
            parametros.Add("@spa_ID", item.spa_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@usu_UsuarioEliminacion", item.usu_UsuarioEliminacion, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@spa_FechaEliminacion", item.spa_FechaEliminacion, DbType.DateTime, ParameterDirection.Input);
            var answer = db.QueryFirst<string>(ScriptsDataBase.EliminarSolicitudApoyoAsignada, parametros, commandType: CommandType.StoredProcedure);
            result.MessageStatus = answer;
            return result;
        }

        public tbSolicitudApoyoAsignada Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbSolicitudApoyoAsignada item)
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            RequestStatus result = new RequestStatus();
            var parametros = new DynamicParameters();
            parametros.Add("@sol_ID", item.sol_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@per_ID", item.per_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@spa_Cancel", item.spa_Cancel, DbType.Boolean, ParameterDirection.Input);
            parametros.Add("@usu_UsuarioCreacion", item.usu_UsuarioCreacion, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@spa_FechaCreacion", item.spa_FechaCreacion, DbType.DateTime, ParameterDirection.Input);
            var answer = db.QueryFirst<string>(ScriptsDataBase.CrearSolicitudApoyoAsignada, parametros, commandType: CommandType.StoredProcedure);
            result.MessageStatus = answer;
            return result;
        }

        public IEnumerable<tbSolicitudApoyoAsignada> List()
        {
            throw new NotImplementedException();
        }

        public RequestStatus Update(tbSolicitudApoyoAsignada item)
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            RequestStatus result = new RequestStatus();
            var parametros = new DynamicParameters();
            parametros.Add("@spa_ID", item.spa_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@sol_ID", item.sol_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@per_ID", item.per_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@spa_Cancel", item.spa_Cancel, DbType.Boolean, ParameterDirection.Input);
            parametros.Add("@usu_UsuarioModificacion", item.usu_UsuarioModificacion, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@spa_FechaModificacion", item.spa_FechaModificacion, DbType.DateTime, ParameterDirection.Input);
            var answer = db.QueryFirst<string>(ScriptsDataBase.EditarSolicitudApoyoAsignada, parametros, commandType: CommandType.StoredProcedure);
            result.MessageStatus = answer;
            return result;
        }
    }
}
