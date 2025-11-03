using AutoMapper;
using SUDENEXT.API.Models.ModelsGeneral;
using SUDENEXT.Entities.DTO;
using SUDENEXT.Entities.Entities;

namespace SUDENEXT.API.Extensions
{
    public class MappingProfileExtensions : Profile
    {
        public MappingProfileExtensions()
        {
            #region Academico
            #endregion

            #region Acceso
            //CreateMap<UsuariosViewModel, tbUsuarios>().ReverseMap();
            #endregion

            #region General
            CreateMap<PersonalViewModel, tbPersonal>().ReverseMap();
            CreateMap<ListadoPersonalViewModel, ListadoPersonalDTO>().ReverseMap();
            #endregion

            #region General
            #endregion

        }
    }
}
