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
            #endregion

            #region General
            CreateMap<PersonalViewModel, tbPersonal>().ReverseMap();
            CreateMap<ListadoPersonalViewModel, ListadoPersonalDTO>().ReverseMap();

            CreateMap<AreasViewModel, tbAreas>().ReverseMap();
            CreateMap<ListadoAreasViewModel, ListadoAreasDTO>().ReverseMap();
            #endregion

            #region General
            #endregion

        }
    }
}
