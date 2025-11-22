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
    public class EstudiantesRepository : IRepository<tbEstudiantes>
    {

        public EstudiantesLoginResult Login(tbEstudiantes item)
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            var parametros = new DynamicParameters();
            parametros.Add("@est_NumeroCuenta", item.est_NumeroCuenta, DbType.String, ParameterDirection.Input);
            parametros.Add("@est_Contra", item.est_Contra, DbType.String, ParameterDirection.Input);

            var resultado = db.QueryFirst<EstudiantesLoginResult>(ScriptsDataBase.EstudiantesLogin, parametros, commandType: CommandType.StoredProcedure);
            return resultado;
        }

        public RequestStatus Delete(tbEstudiantes item)
        {
            throw new NotImplementedException();
        }

        public tbEstudiantes Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbEstudiantes item)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<tbEstudiantes> List()
        {
            throw new NotImplementedException();
        }

        public RequestStatus Update(tbEstudiantes item)
        {
            throw new NotImplementedException();
        }
    }
}
