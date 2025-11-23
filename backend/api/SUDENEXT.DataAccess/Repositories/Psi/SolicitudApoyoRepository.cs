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
    public class SolicitudApoyoRepository : IRepository<tbSolicitudApoyo>
    {
        public RequestStatus Delete(tbSolicitudApoyo item)
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            RequestStatus result = new RequestStatus();
            var parametros = new DynamicParameters();
            parametros.Add("@sol_ID", item.sol_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@sol_FechaEliminacion", item.sol_FechaEliminacion, DbType.DateTime, ParameterDirection.Input);
            var answer = db.QueryFirst<string>(ScriptsDataBase.EliminarSolicitudApoyo, parametros, commandType: CommandType.StoredProcedure);
            result.MessageStatus = answer;
            return result;
        }

        public tbSolicitudApoyo Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbSolicitudApoyo item)
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            RequestStatus result = new RequestStatus();
            var parametros = new DynamicParameters();
            parametros.Add("@est_ID", item.est_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@sol_ResumenSesion", item.sol_ResumenSesion, DbType.String, ParameterDirection.Input);
            parametros.Add("@sol_MotivoConsulta", item.sol_MotivoConsulta, DbType.String, ParameterDirection.Input);
            parametros.Add("@sol_MalestarEmocional", item.sol_MalestarEmocional, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@sol_Asistencia", item.sol_Asistencia, DbType.Boolean, ParameterDirection.Input);
            parametros.Add("@sol_HorarioPref", item.sol_HorarioPref, DbType.String, ParameterDirection.Input);
            parametros.Add("@sol_FechaCreacion", item.sol_FechaCreacion, DbType.DateTime, ParameterDirection.Input);
            var answer = db.QueryFirst<string>(ScriptsDataBase.CrearSolicitudApoyo, parametros, commandType: CommandType.StoredProcedure);
            result.MessageStatus = answer;
            return result;
        }

        public IEnumerable<tbSolicitudApoyo> List()
        {
            throw new NotImplementedException();
        }

        public IEnumerable<ListadoSolicitudSesionApoyoDTO> ListadoCompleto()
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            var parametros = new DynamicParameters();
            return db.Query<ListadoSolicitudSesionApoyoDTO>(ScriptsDataBase.ListarSolicitudApoyo, null, commandType: CommandType.StoredProcedure);
        }

        public IEnumerable<ListadoSolicitudSesionApoyoDTO> ListadoTOP5Estudiante(tbSolicitudApoyo item)
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            var parametros = new DynamicParameters();
            parametros.Add("@est_ID", item.est_ID, DbType.Int32, ParameterDirection.Input);
            return db.Query<ListadoSolicitudSesionApoyoDTO>(ScriptsDataBase.ListarSolicitudApoyoEstudiante,  parametros, commandType: CommandType.StoredProcedure);
        }

        public RequestStatus Update(tbSolicitudApoyo item)
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            RequestStatus result = new RequestStatus();
            var parametros = new DynamicParameters();
            parametros.Add("@sol_ID", item.sol_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@est_ID", item.est_ID, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@sol_ResumenSesion", item.sol_ResumenSesion, DbType.String, ParameterDirection.Input);
            parametros.Add("@sol_MotivoConsulta", item.sol_MotivoConsulta, DbType.String, ParameterDirection.Input);
            parametros.Add("@sol_MalestarEmocional", item.sol_MalestarEmocional, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@sol_Asistencia", item.sol_Asistencia, DbType.Boolean, ParameterDirection.Input);
            parametros.Add("@sol_HorarioPref", item.sol_HorarioPref, DbType.String, ParameterDirection.Input);
            parametros.Add("@sol_FechaModificacion", item.sol_FechaModificacion, DbType.DateTime, ParameterDirection.Input);
            var answer = db.QueryFirst<string>(ScriptsDataBase.EditarSolicitudApoyo, parametros, commandType: CommandType.StoredProcedure);
            result.MessageStatus = answer;
            return result;
        }
    }
}
