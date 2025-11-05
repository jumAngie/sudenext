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

namespace SUDENEXT.DataAccess.Repositories.Acad
{
    public class ConsultasAcademicasRepository : IRepository<tbConsultasAcademicas>
    {
        public RequestStatus Delete(tbConsultasAcademicas item)
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            RequestStatus result = new RequestStatus();
            var parametros = new DynamicParameters();
            parametros.Add("@coa_ID", item.coa_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@usu_UsuarioEliminacion", item.usu_UsuarioEliminacion, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@coa_FechaEliminacion", item.coa_FechaEliminacion, DbType.DateTime, ParameterDirection.Input);
            var answer = db.QueryFirst<string>(ScriptsDataBase.EliminarConsultaAcademicas, parametros, commandType: CommandType.StoredProcedure);
            result.MessageStatus = answer;
            return result;
        }

        public tbConsultasAcademicas Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbConsultasAcademicas item)
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            RequestStatus result = new RequestStatus();
            var parametros = new DynamicParameters();
            parametros.Add("@est_ID", item.est_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@tic_ID", item.tic_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@coa_Descripcion", item.coa_Descripcion, DbType.String, ParameterDirection.Input);
            parametros.Add("@coa_Recomendacion", item.coa_Recomendacion, DbType.String, ParameterDirection.Input);
            parametros.Add("@coa_Seguimiento", item.coa_Seguimiento, DbType.Boolean, ParameterDirection.Input);
            parametros.Add("@usu_UsuarioCreacion", item.usu_UsuarioCreacion, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@coa_FechaCreacion", item.coa_FechaCreacion, DbType.DateTime, ParameterDirection.Input);
            var answer = db.QueryFirst<string>(ScriptsDataBase.CrearConsultaAcademicas, parametros, commandType: CommandType.StoredProcedure);
            result.MessageStatus = answer;
            return result;
        }

        public IEnumerable<tbConsultasAcademicas> List()
        {
            throw new NotImplementedException();
        }

        public IEnumerable<ListadoConsultasAcademicasDTO> ListadoCompleto()
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            var parametros = new DynamicParameters();
            return db.Query<ListadoConsultasAcademicasDTO>(ScriptsDataBase.ListarConsultaAcademicas, null, commandType: CommandType.StoredProcedure);
        }

        public RequestStatus Update(tbConsultasAcademicas item)
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            RequestStatus result = new RequestStatus();
            var parametros = new DynamicParameters();
            parametros.Add("@coa_ID", item.coa_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@est_ID", item.est_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@tic_ID", item.tic_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@coa_Descripcion", item.coa_Descripcion, DbType.String, ParameterDirection.Input);
            parametros.Add("@coa_Recomendacion", item.coa_Recomendacion, DbType.String, ParameterDirection.Input);
            parametros.Add("@coa_Seguimiento", item.coa_Seguimiento, DbType.Boolean, ParameterDirection.Input);
            parametros.Add("@usu_UsuarioModificacion", item.usu_UsuarioModificacion, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@coa_FechaModificacion", item.coa_FechaModificacion, DbType.DateTime, ParameterDirection.Input);
            var answer = db.QueryFirst<string>(ScriptsDataBase.EditarConsultaAcademicas, parametros, commandType: CommandType.StoredProcedure);
            result.MessageStatus = answer;
            return result;
        }
    }
}
