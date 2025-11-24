using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SUDENEXT.API.Models.ModelsPsicologia;
using SUDENEXT.BussinessLogic.Services.PsicologiaServices;
using SUDENEXT.Entities.Entities;

namespace SUDENEXT.API.Controllers.ControllersPsicologia
{
    [Route("api/[controller]")]
    [ApiController]
    public class SolicitudApoyoAsignadaController : Controller
    {
        private readonly PsicologiaService _psicologiaService;
        private readonly IMapper _mapper;

        public SolicitudApoyoAsignadaController(PsicologiaService psicologiaService, IMapper mapper)
        {
            _psicologiaService = psicologiaService;
            _mapper = mapper;
        }

        [HttpPost("Insertar")]
        public IActionResult Insert(SolicitudApoyoAsignadaViewModel solicitudApoyoAsignada)
        {
            var item = _mapper.Map<tbSolicitudApoyoAsignada>(solicitudApoyoAsignada);
            var respuesta = _psicologiaService.CrearSolicitudApoyoAsignada(item);
            return Ok(respuesta);
        }

        [HttpPost("Editar")]
        public IActionResult Update(SolicitudApoyoAsignadaViewModel solicitudApoyoAsignada)
        {
            var item = _mapper.Map<tbSolicitudApoyoAsignada>(solicitudApoyoAsignada);
            var respuesta = _psicologiaService.EditarSolicitudApoyoAsignada(item);
            return Ok(respuesta);
        }

        [HttpPost("Eliminar")]
        public IActionResult Delete(SolicitudApoyoAsignadaViewModel solicitudApoyoAsignada)
        {
            var item = _mapper.Map<tbSolicitudApoyoAsignada>(solicitudApoyoAsignada);
            var respuesta = _psicologiaService.EliminarSolicitudApoyoAsignada(item);
            return Ok(respuesta);
        }
    }
}
