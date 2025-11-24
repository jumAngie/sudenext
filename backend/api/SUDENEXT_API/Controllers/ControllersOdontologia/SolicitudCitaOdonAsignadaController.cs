using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SUDENEXT.API.Models.ModelsOdontologia;
using SUDENEXT.BussinessLogic.Services.OdontologiaServices;
using SUDENEXT.Entities.Entities;

namespace SUDENEXT.API.Controllers.ControllersOdontologia
{
    [Route("api/[controller]")]
    [ApiController]
    public class SolicitudCitaOdonAsignadaController : Controller
    {
        private readonly OdontologiaService _odontologiaService;
        private readonly IMapper _mapper;

        public SolicitudCitaOdonAsignadaController(OdontologiaService odontologiaService, IMapper mapper)
        {
            _odontologiaService = odontologiaService;
            _mapper = mapper;
        }

        [HttpPost("Insertar")]
        public IActionResult Insert(SolicitudCitaOdonAsignadaViewModel odonAsignadaViewModel)
        {
            var item = _mapper.Map<tbSolicitudOdonAsignada>(odonAsignadaViewModel);
            var respuesta = _odontologiaService.CrearSolicitudCitaOdonAsignada(item);
            return Ok(respuesta);
        }

        [HttpPost("Editar")]
        public IActionResult Update(SolicitudCitaOdonAsignadaViewModel odonAsignadaViewModel)
        {
            var item = _mapper.Map<tbSolicitudOdonAsignada>(odonAsignadaViewModel);
            var respuesta = _odontologiaService.CrearSolicitudCitaOdonAsignada(item);
            return Ok(respuesta);
        }

        [HttpPost("Eliminar")]
        public IActionResult Delete(SolicitudCitaOdonAsignadaViewModel odonAsignadaViewModel)
        {
            var item = _mapper.Map<tbSolicitudOdonAsignada>(odonAsignadaViewModel);
            var respuesta = _odontologiaService.EliminarSolicitudCitaOdonAsignada(item);
            return Ok(respuesta);
        }
    }
}
