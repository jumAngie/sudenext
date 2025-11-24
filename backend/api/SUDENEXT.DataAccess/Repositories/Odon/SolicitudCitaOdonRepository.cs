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

namespace SUDENEXT.DataAccess.Repositories.Odon
{
    public class SolicitudCitaOdonRepository : IRepository<tbSolicitudCitaOdon>
    {
        public RequestStatus Delete(tbSolicitudCitaOdon item)
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            RequestStatus result = new RequestStatus();
            var parametros = new DynamicParameters();
            parametros.Add("@sco_ID", item.sco_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@sco_FechaEliminacion", item.sco_FechaEliminacion, DbType.DateTime, ParameterDirection.Input);
            var answer = db.QueryFirst<string>(ScriptsDataBase.EliminarSolicitudCitaOdon, parametros, commandType: CommandType.StoredProcedure);
            result.MessageStatus = answer;
            return result;
        }

        public tbSolicitudCitaOdon Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbSolicitudCitaOdon item)
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            RequestStatus result = new RequestStatus();
            var parametros = new DynamicParameters();
            parametros.Add("@est_ID", item.est_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@sco_FechaP", item.sco_FechaP, DbType.DateTime, ParameterDirection.Input);
            parametros.Add("@sco_Hora", item.sco_Hora, DbType.String, ParameterDirection.Input);
            parametros.Add("@sco_Motivo", item.sco_Motivo, DbType.String, ParameterDirection.Input);
            parametros.Add("@sco_Prioridad", item.sco_Prioridad, DbType.String, ParameterDirection.Input);
            parametros.Add("@sco_FechaCreacion", item.sco_FechaCreacion, DbType.DateTime, ParameterDirection.Input);
            var answer = db.QueryFirst<string>(ScriptsDataBase.CrearSolicitudCitaOdon, parametros, commandType: CommandType.StoredProcedure);
            result.MessageStatus = answer;
            return result;
        }

        public IEnumerable<tbSolicitudCitaOdon> List()
        {
            throw new NotImplementedException();
        }

        public IEnumerable<ListadoSolicitudOdontologicaDTO> ListadoCompleto()
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            var parametros = new DynamicParameters();
            return db.Query<ListadoSolicitudOdontologicaDTO>(ScriptsDataBase.ListarSolicitudCitaOdon, null, commandType: CommandType.StoredProcedure);
        }

        public RequestStatus Update(tbSolicitudCitaOdon item)
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            RequestStatus result = new RequestStatus();
            var parametros = new DynamicParameters();
            parametros.Add("@sco_ID", item.sco_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@est_ID", item.est_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@sco_FechaP", item.sco_FechaP, DbType.DateTime, ParameterDirection.Input);
            parametros.Add("@sco_Hora", item.sco_Hora, DbType.String, ParameterDirection.Input);
            parametros.Add("@sco_Motivo", item.sco_Motivo, DbType.String, ParameterDirection.Input);
            parametros.Add("@sco_Prioridad", item.sco_Prioridad, DbType.String, ParameterDirection.Input);
            parametros.Add("@sco_FechaModificacion", item.sco_FechaModificacion, DbType.DateTime, ParameterDirection.Input);
            var answer = db.QueryFirst<string>(ScriptsDataBase.EditarSolicitudCitaOdon, parametros, commandType: CommandType.StoredProcedure);
            result.MessageStatus = answer;
            return result;
        }
    }
}
