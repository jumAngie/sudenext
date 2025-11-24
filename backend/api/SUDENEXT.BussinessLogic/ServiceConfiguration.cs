using Microsoft.Extensions.DependencyInjection;
using SUDENEXT.BussinessLogic.Services.AcademicoServices;
using SUDENEXT.BussinessLogic.Services.AccesoServices;
using SUDENEXT.BussinessLogic.Services.GeneralServices;
using SUDENEXT.BussinessLogic.Services.MedicinaServices;
using SUDENEXT.BussinessLogic.Services.OdontologiaServices;
using SUDENEXT.BussinessLogic.Services.PsicologiaServices;
using SUDENEXT.DataAccess.Repositories.Acad;
using SUDENEXT.DataAccess.Repositories.Acce;
using SUDENEXT.DataAccess.Repositories.Gral;
using SUDENEXT.DataAccess.Repositories.Med;
using SUDENEXT.DataAccess.Repositories.Odon;
using SUDENEXT.DataAccess.Repositories.Psi;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SUDENEXT.BussinessLogic
{
    public static class ServiceConfiguration
    {
        public static void DataAccess(this IServiceCollection services, string connection)
        {
            SUDENEXT.DataAccess.SUDENEXTContext.BuildConnectionString(connection);

            //Acad
            services.AddScoped<ConsultasAcademicasRepository>();
            services.AddScoped<TipoConsultaRepository>();

            //Acceso
            services.AddScoped<UsuariosRepository>();
            services.AddScoped<RolesRepository>();
            services.AddScoped<RolesXPantallasRepository>();
            services.AddScoped<PantallasRepository>();

            //General
            services.AddScoped<AreasRepository>();
            services.AddScoped<EstudiantesRepository>();
            services.AddScoped<PersonalRepository>();

            // Medicina
            services.AddScoped<DiagnosticosMedicosRepository>();

            // Odontología
            services.AddScoped<DiagnosticoOdonRepository>();
            services.AddScoped<SolicitudCitaOdonRepository>();
            services.AddScoped<TratamientosRepository>();
            services.AddScoped<SolicitudCitaOdonAsignadaRepository>();

            // Psicologia
            services.AddScoped<PlanAccionRepository>();
            services.AddScoped<SolicitudApoyoRepository>();
            services.AddScoped<SolicitudesXPlanesRepository>();
            services.AddScoped<SolicitudApoyoAsignadaRepository>();

        }

        public static void BussinessLogic(this IServiceCollection services)
        {
            services.AddScoped<AcademicoService>();
            services.AddScoped<AccesoService>();
            services.AddScoped<GeneralService>();
            services.AddScoped<MedicinaService>();
            services.AddScoped<OdontologiaService>();
            services.AddScoped<PsicologiaService>();
        }
    }
}
