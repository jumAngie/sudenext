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
    public class DiagnosticoOdonRepository : IRepository<tbDiagnosticoOdonto>
    {
        public RequestStatus Delete(tbDiagnosticoOdonto item)
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            RequestStatus result = new RequestStatus();
            var parametros = new DynamicParameters();
            parametros.Add("@trd_ID", item.trd_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@trd_FechaEliminacion", item.trd_FechaEliminacion, DbType.DateTime, ParameterDirection.Input);
            parametros.Add("@usu_UsuarioEliminacion", item.usu_UsuarioEliminacion, DbType.Int32, ParameterDirection.Input);
            var answer = db.QueryFirst<string>(ScriptsDataBase.EliminarDiagnosticoOdon, parametros, commandType: CommandType.StoredProcedure);
            result.MessageStatus = answer;
            return result;
        }

        public IEnumerable<ListadoDiagnosticoOdontoDTO> ListadoCompleto()
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            var parametros = new DynamicParameters();
            return db.Query<ListadoDiagnosticoOdontoDTO>(ScriptsDataBase.ListarDiagnosticoOdon, null, commandType: CommandType.StoredProcedure);
        }

        public tbDiagnosticoOdonto Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbDiagnosticoOdonto item)
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            RequestStatus result = new RequestStatus();
            var parametros = new DynamicParameters();
            parametros.Add("@sca_ID", item.sca_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@tra_ID", item.tra_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@trd_Descripcion", item.trd_Descripcion, DbType.String, ParameterDirection.Input);
            parametros.Add("@trd_Diagnostico", item.trd_Diagnostico, DbType.String, ParameterDirection.Input);
            parametros.Add("@trd_Duracion", item.trd_Duracion, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@trd_Costo", item.trd_Costo, DbType.Decimal, ParameterDirection.Input);
            parametros.Add("@trd_Seguimiento", item.trd_Seguimiento, DbType.Boolean, ParameterDirection.Input);
            parametros.Add("@trd_FechaSeg", item.trd_FechaSeg, DbType.Date, ParameterDirection.Input);
            parametros.Add("@trd_Instrucciones", item.trd_Instrucciones, DbType.String, ParameterDirection.Input);
            parametros.Add("@trd_Observaciones", item.trd_Observaciones, DbType.String, ParameterDirection.Input);
            parametros.Add("@usu_UsuarioCreacion", item.usu_UsuarioCreacion, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@trd_FechaCreacion", item.trd_FechaCreacion, DbType.DateTime, ParameterDirection.Input);
            var answer = db.QueryFirst<string>(ScriptsDataBase.CrearDiagnosticoOdon, parametros, commandType: CommandType.StoredProcedure);
            result.MessageStatus = answer;
            return result;
        }

        public IEnumerable<tbDiagnosticoOdonto> List()
        {
            throw new NotImplementedException();
        }

        public RequestStatus Update(tbDiagnosticoOdonto item)
        {
            throw new NotImplementedException();
        }
    }
}
