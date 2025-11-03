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
    public class PersonalRepository : IRepository<tbPersonal>
    {
        public RequestStatus Delete(tbPersonal item)
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            RequestStatus result = new RequestStatus();
            var parametros = new DynamicParameters();
            parametros.Add("@per_ID", item.per_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@usu_UsuarioEliminacion", item.usu_UsuarioEliminacion, DbType.Int32, ParameterDirection.Input);
            var answer = db.QueryFirst<string>(ScriptsDataBase.EliminarPersonal, parametros, commandType: CommandType.StoredProcedure);
            result.MessageStatus = answer;
            return result;
        }

        public tbPersonal Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbPersonal item)
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            RequestStatus result = new RequestStatus();
            var parametros = new DynamicParameters();
            parametros.Add("@per_Nombres",          item.per_Nombres,           DbType.String,  ParameterDirection.Input);
            parametros.Add("@per_Apellidos",        item.per_Apellidos,         DbType.String,  ParameterDirection.Input);
            parametros.Add("@per_EstadoCivil",      item.per_EstadoCivil,       DbType.String,  ParameterDirection.Input);
            parametros.Add("@per_Sexo",             item.per_Sexo,              DbType.String,  ParameterDirection.Input);
            parametros.Add("@per_FechaNac",         item.per_FechaNac,          DbType.Date,    ParameterDirection.Input);
            parametros.Add("@per_Telefono",         item.per_Telefono,          DbType.String,  ParameterDirection.Input);
            parametros.Add("@per_Direccion",        item.per_Direccion,         DbType.String,  ParameterDirection.Input);
            parametros.Add("@per_Correo",           item.per_Correo,            DbType.String,  ParameterDirection.Input);
            parametros.Add("@are_ID",               item.are_ID,                DbType.Int32,   ParameterDirection.Input);
            parametros.Add("@usu_UsuarioCreacion",  item.usu_UsuarioCreacion,   DbType.Int32,   ParameterDirection.Input);
            var answer = db.QueryFirst<string>(ScriptsDataBase.CrearPersonal, parametros, commandType: CommandType.StoredProcedure);
            result.MessageStatus = answer;
            return result;
        }

        public IEnumerable<tbPersonal> List()
        {
            throw new NotImplementedException();
        }

        public IEnumerable<ListadoPersonalDTO> ListadoCompleto()
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            var parametros = new DynamicParameters();
            return db.Query<ListadoPersonalDTO>(ScriptsDataBase.ListarPersonal, null, commandType: CommandType.StoredProcedure);
        }

        public RequestStatus Update(tbPersonal item)
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            RequestStatus result = new RequestStatus();
            var parametros = new DynamicParameters();
            parametros.Add("@per_ID",                   item.per_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@per_Nombres",              item.per_Nombres, DbType.String, ParameterDirection.Input);
            parametros.Add("@per_Apellidos",            item.per_Apellidos, DbType.String, ParameterDirection.Input);
            parametros.Add("@per_EstadoCivil",          item.per_EstadoCivil, DbType.String, ParameterDirection.Input);
            parametros.Add("@per_Sexo",                 item.per_Sexo, DbType.String, ParameterDirection.Input);
            parametros.Add("@per_FechaNac",             item.per_FechaNac, DbType.Date, ParameterDirection.Input);
            parametros.Add("@per_Telefono",             item.per_Telefono, DbType.String, ParameterDirection.Input);
            parametros.Add("@per_Direccion",            item.per_Direccion, DbType.String, ParameterDirection.Input);
            parametros.Add("@per_Correo",               item.per_Correo, DbType.String, ParameterDirection.Input);
            parametros.Add("@are_ID",                   item.are_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@usu_UsuarioModificacion", item.usu_UsuarioModificacion, DbType.Int32, ParameterDirection.Input);
            var answer = db.QueryFirst<string>(ScriptsDataBase.EditarPersonal, parametros, commandType: CommandType.StoredProcedure);
            result.MessageStatus = answer;
            return result;
        }
    }
}
