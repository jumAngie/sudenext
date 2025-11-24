using AutoMapper;
using SUDENEXT.API.Models.ModelsAcademico;
using SUDENEXT.API.Models.ModelsAcceso;
using SUDENEXT.API.Models.ModelsGeneral;
using SUDENEXT.API.Models.ModelsOdontologia;
using SUDENEXT.API.Models.ModelsPsicologia;
using SUDENEXT.Entities.DTO;
using SUDENEXT.Entities.Entities;

namespace SUDENEXT.API.Extensions
{
    public class MappingProfileExtensions : Profile
    {
        public MappingProfileExtensions()
        {
            #region Academico
            CreateMap<ConsultaAcademicasViewModel, tbConsultasAcademicas>().ReverseMap();
            CreateMap<ListadoConsultaAcademicasViewModel, ListadoConsultasAcademicasDTO>().ReverseMap();

            CreateMap<TipoConsultaViewModel, tbTipoConsulta>().ReverseMap();
            CreateMap<ListadoTipoConsultaViewModel, ListadoTipoConsultaDTO>().ReverseMap();
            #endregion

            #region Acceso
            CreateMap<LoginUsuariosViewModel, tbUsuarios>().ReverseMap();

            CreateMap<ListadoUsuariosViewModel, ListadoUsuariosDTO>().ReverseMap();
            CreateMap<UsuariosViewModel, tbUsuarios>().ReverseMap();

            CreateMap<ListadoRolesViewModel, ListadoRolesDTO>().ReverseMap();
            CreateMap<RolesViewModel, tbRoles>().ReverseMap();
            #endregion

            #region General
            CreateMap<PersonalViewModel, tbPersonal>().ReverseMap();
            CreateMap<ListadoPersonalViewModel, ListadoPersonalDTO>().ReverseMap();

            CreateMap<AreasViewModel, tbAreas>().ReverseMap();
            CreateMap<ListadoAreasViewModel, ListadoAreasDTO>().ReverseMap();

            CreateMap<EstudiantesViewModel, tbEstudiantes>().ReverseMap();
            CreateMap<LoginEstudiantesViewModel, tbEstudiantes>().ReverseMap();
            #endregion

            #region Odontología
            CreateMap<TipoTratamientoViewMoel, tbTratamientos>().ReverseMap();
            CreateMap<ListadoTipoTratamientoViewModel, ListadoTipoTratamientoDTO>().ReverseMap();

            CreateMap<SolicitudCitaOdonViewModel, tbSolicitudCitaOdon>().ReverseMap();
            CreateMap<ListadoSolicitudCitaOdonViewModel, ListadoSolicitudOdontologicaDTO>().ReverseMap();

            CreateMap<SolicitudCitaOdonAsignadaViewModel, tbSolicitudOdonAsignada>().ReverseMap();
            #endregion

            #region Psicología
            CreateMap<PlanAccionViewModel, tbPlanAccion>().ReverseMap();
            CreateMap<ListadoPlanAccionViewModel, ListadoPlanAccionDTO>().ReverseMap();

            CreateMap<SolicitudApoyoViewModel, tbSolicitudApoyo>().ReverseMap();
            CreateMap<ListadoSolicitudApoyoViewModel, ListadoSolicitudSesionApoyoDTO>().ReverseMap();

            CreateMap<SolicitudApoyoAsignadaViewModel, tbSolicitudApoyoAsignada>().ReverseMap();
            #endregion

        }
    }
}
