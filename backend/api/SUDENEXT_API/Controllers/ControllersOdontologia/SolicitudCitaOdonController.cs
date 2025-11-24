using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SUDENEXT.API.Models.ModelsOdontologia;
using SUDENEXT.BussinessLogic.Services.OdontologiaServices;
using SUDENEXT.BussinessLogic.Services.PsicologiaServices;
using SUDENEXT.Entities.Entities;

namespace SUDENEXT.API.Controllers.ControllersOdontologia
{
    [Route("api/[controller]")]
    [ApiController]
    public class SolicitudCitaOdonController : Controller
    {
        private readonly OdontologiaService _odontologiaService;
        private readonly IMapper _mapper;

        public SolicitudCitaOdonController(OdontologiaService odontologiaService, IMapper mapper)
        {
            _odontologiaService = odontologiaService;
            _mapper = mapper;
        }

        [HttpGet("Listar")]
        public IActionResult Index()
        {
            var listado = _odontologiaService.ListadoSolicitudCitaOdonCompleto();
            listado.Data = _mapper.Map<IEnumerable<ListadoSolicitudCitaOdonViewModel>>(listado.Data);
            return Ok(listado);

        }

        [HttpPost("Insertar")]
        public IActionResult Insert(SolicitudCitaOdonViewModel solicitudCitaOdonView)
        {
            var item = _mapper.Map<tbSolicitudCitaOdon>(solicitudCitaOdonView);
            var respuesta = _odontologiaService.CrearSolicitudCitaOdon(item);
            return Ok(respuesta);
        }

        [HttpPost("Editar")]
        public IActionResult Update(SolicitudCitaOdonViewModel solicitudCitaOdonView)
        {
            var item = _mapper.Map<tbSolicitudCitaOdon>(solicitudCitaOdonView);
            var respuesta = _odontologiaService.EditarSolicitudCitaOdon(item);
            return Ok(respuesta);
        }

        [HttpPost("Eliminar")]
        public IActionResult Delete(SolicitudCitaOdonViewModel solicitudCitaOdonView)
        {
            var item = _mapper.Map<tbSolicitudCitaOdon>(solicitudCitaOdonView);
            var respuesta = _odontologiaService.EliminarSolicitudCitaOdon(item);
            return Ok(respuesta);
        }
    }
}
