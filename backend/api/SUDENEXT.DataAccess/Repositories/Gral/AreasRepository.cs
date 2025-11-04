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

namespace SUDENEXT.DataAccess.Repositories.Gral
{
    public class AreasRepository : IRepository<tbAreas>
    {
       
        public RequestStatus Delete(tbAreas item)
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            RequestStatus result = new RequestStatus();
            var parametros = new DynamicParameters();
            parametros.Add("@are_ID", item.are_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@usu_UsuarioEliminacion", item.usu_UsuarioEliminacion, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@are_FechaEliminacion", item.are_FechaEliminacion, DbType.DateTime, ParameterDirection.Input);
            var answer = db.QueryFirst<string>(ScriptsDataBase.EliminarAreas, parametros, commandType: CommandType.StoredProcedure);
            result.MessageStatus = answer;
            return result;
        }

        public tbAreas Find(int? id)
        {
            throw new NotImplementedException();
        }
        
        public RequestStatus Insert(tbAreas item)
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            RequestStatus result = new RequestStatus();
            var parametros = new DynamicParameters();
            parametros.Add("@are_Nombre", item.are_Nombre, DbType.String, ParameterDirection.Input);
            parametros.Add("@usu_UsuarioCreacion", item.usu_UsuarioCreacion, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@are_FechaCreacion", item.are_FechaCreacion, DbType.DateTime, ParameterDirection.Input);
            var answer = db.QueryFirst<string>(ScriptsDataBase.CrearAreas, parametros, commandType: CommandType.StoredProcedure);
            result.MessageStatus = answer;
            return result;
        }

        public IEnumerable<tbAreas> List()
        {
            throw new NotImplementedException();
        }

        public IEnumerable<ListadoAreasDTO> ListadoCompleto()
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            var parametros = new DynamicParameters();
            return db.Query<ListadoAreasDTO>(ScriptsDataBase.ListarAreas, null, commandType: CommandType.StoredProcedure);
        }

        public RequestStatus Update(tbAreas item)
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            RequestStatus result = new RequestStatus();
            var parametros = new DynamicParameters();
            parametros.Add("@are_ID", item.are_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@are_Nombre", item.are_Nombre, DbType.String, ParameterDirection.Input);
            parametros.Add("@usu_UsuarioModificacion", item.usu_UsuarioModificacion, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@are_FechaModificacion", item.are_FechaModificacion, DbType.DateTime, ParameterDirection.Input);
            var answer = db.QueryFirst<string>(ScriptsDataBase.EditarAreas, parametros, commandType: CommandType.StoredProcedure);
            result.MessageStatus = answer;
            return result;
        }
    }
}
