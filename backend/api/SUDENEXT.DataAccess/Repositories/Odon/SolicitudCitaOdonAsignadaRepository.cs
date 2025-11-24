using Dapper;
using Microsoft.Data.SqlClient;
using SUDENEXT.Entities.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SUDENEXT.DataAccess.Repositories.Odon
{
    public class SolicitudCitaOdonAsignadaRepository : IRepository<tbSolicitudOdonAsignada>
    {
        public RequestStatus Delete(tbSolicitudOdonAsignada item)
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            RequestStatus result = new RequestStatus();
            var parametros = new DynamicParameters();
            parametros.Add("@sca_ID", item.sca_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@usu_UsuarioEliminacion", item.usu_UsuarioEliminacion, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@sca_FechaEliminacion", item.sca_FechaEliminacion, DbType.DateTime, ParameterDirection.Input);
            var answer = db.QueryFirst<string>(ScriptsDataBase.EliminarSolicitudOdonAsignada, parametros, commandType: CommandType.StoredProcedure);
            result.MessageStatus = answer;
            return result;
        }

        public tbSolicitudOdonAsignada Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbSolicitudOdonAsignada item)
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            RequestStatus result = new RequestStatus();
            var parametros = new DynamicParameters();
            parametros.Add("@sco_ID", item.sco_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@per_ID", item.per_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@sca_Cancel", item.sca_Cancel, DbType.Boolean, ParameterDirection.Input);
            parametros.Add("@usu_UsuarioCreacion", item.usu_UsuarioCreacion, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@sca_FechaCreacion", item.sca_FechaCreacion, DbType.DateTime, ParameterDirection.Input);
            var answer = db.QueryFirst<string>(ScriptsDataBase.CrearSolicitudOdonAsignada, parametros, commandType: CommandType.StoredProcedure);
            result.MessageStatus = answer;
            return result;
        }

        public IEnumerable<tbSolicitudOdonAsignada> List()
        {
            throw new NotImplementedException();
        }

        public RequestStatus Update(tbSolicitudOdonAsignada item)
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            RequestStatus result = new RequestStatus();
            var parametros = new DynamicParameters();
            parametros.Add("@sca_ID", item.sca_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@sco_ID", item.sco_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@per_ID", item.per_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@sca_Cancel", item.sca_Cancel, DbType.Boolean, ParameterDirection.Input);
            parametros.Add("@usu_UsuarioModificacion", item.usu_UsuarioModificacion, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@sca_FechaModificacion", item.sca_FechaModificacion, DbType.DateTime, ParameterDirection.Input);
            var answer = db.QueryFirst<string>(ScriptsDataBase.EditarSolicitudOdonAsignada, parametros, commandType: CommandType.StoredProcedure);
            result.MessageStatus = answer;
            return result;
        }
    }
}
