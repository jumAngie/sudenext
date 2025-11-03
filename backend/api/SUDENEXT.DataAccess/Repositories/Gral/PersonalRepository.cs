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
            throw new NotImplementedException();
        }

        public tbPersonal Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbPersonal item)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<tbPersonal> List()
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            var parametros = new DynamicParameters();
            return db.Query<tbPersonal>(ScriptsDataBase.ListarPersonal, null, commandType: CommandType.StoredProcedure);
        }

        public IEnumerable<ListadoPersonalDTO> ListadoCompleto()
        {
            using var db = new SqlConnection(SUDENEXTContext.ConnectionString);
            var parametros = new DynamicParameters();
            return db.Query<ListadoPersonalDTO>(ScriptsDataBase.ListarPersonal, null, commandType: CommandType.StoredProcedure);
        }

        public RequestStatus Update(tbPersonal item)
        {
            throw new NotImplementedException();
        }
    }
}
