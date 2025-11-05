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

namespace SUDENEXT.DataAccess.Repositories.Psi
{
    public class PlanAccionRepository : IRepository<tbPlanAccion>
    {
        public RequestStatus Delete(tbPlanAccion item)
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            RequestStatus result = new RequestStatus();
            var parametros = new DynamicParameters();
            parametros.Add("@pla_ID", item.pla_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@usu_UsuarioEliminacion", item.usu_UsuarioEliminacion, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@pla_FechaEliminacion", item.pla_FechaEliminacion, DbType.DateTime, ParameterDirection.Input);
            var answer = db.QueryFirst<string>(ScriptsDataBase.EliminarPlanAccion, parametros, commandType: CommandType.StoredProcedure);
            result.MessageStatus = answer;
            return result;
        }

        public tbPlanAccion Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbPlanAccion item)
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            RequestStatus result = new RequestStatus();
            var parametros = new DynamicParameters();
            parametros.Add("@pla_ResumenSesion", item.pla_ResumenSesion, DbType.String, ParameterDirection.Input);
            parametros.Add("@pla_Objetivo", item.pla_Objetivo, DbType.String, ParameterDirection.Input);
            parametros.Add("@pla_ActividadSug", item.pla_ActividadSug, DbType.String, ParameterDirection.Input);
            parametros.Add("@pla_FechaSeguimiento", item.pla_FechaSeguimiento, DbType.Date, ParameterDirection.Input);
            parametros.Add("@pla_Observacion", item.pla_Observacion, DbType.String, ParameterDirection.Input);
            parametros.Add("@usu_UsuarioCreacion", item.usu_UsuarioCreacion, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@pla_FechaCreacion", item.pla_FechaCreacion, DbType.DateTime, ParameterDirection.Input);
            var answer = db.QueryFirst<string>(ScriptsDataBase.CrearPlanAccion, parametros, commandType: CommandType.StoredProcedure);
            result.MessageStatus = answer;
            return result;
        }

        public IEnumerable<tbPlanAccion> List()
        {
            throw new NotImplementedException();
        }
        public IEnumerable<ListadoPlanAccionDTO> ListadoCompleto()
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            var parametros = new DynamicParameters();
            return db.Query<ListadoPlanAccionDTO>(ScriptsDataBase.ListarPlanAccion, null, commandType: CommandType.StoredProcedure);
        }

        public RequestStatus Update(tbPlanAccion item)
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            RequestStatus result = new RequestStatus();
            var parametros = new DynamicParameters();
            parametros.Add("@pla_ID", item.pla_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@pla_ResumenSesion", item.pla_ResumenSesion, DbType.String, ParameterDirection.Input);
            parametros.Add("@pla_Objetivo", item.pla_Objetivo, DbType.String, ParameterDirection.Input);
            parametros.Add("@pla_ActividadSug", item.pla_ActividadSug, DbType.String, ParameterDirection.Input);
            parametros.Add("@pla_FechaSeguimiento", item.pla_FechaSeguimiento, DbType.Date, ParameterDirection.Input);
            parametros.Add("@pla_Observacion", item.pla_Observacion, DbType.String, ParameterDirection.Input);
            parametros.Add("@usu_UsuarioModificacion", item.usu_UsuarioModificacion, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@pla_FechaModificacion", item.pla_FechaModificacion, DbType.DateTime, ParameterDirection.Input);
            var answer = db.QueryFirst<string>(ScriptsDataBase.EditarPlanAccion, parametros, commandType: CommandType.StoredProcedure);
            result.MessageStatus = answer;
            return result;
        }
    }
}
