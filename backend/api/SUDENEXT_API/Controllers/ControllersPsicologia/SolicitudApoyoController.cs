using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SUDENEXT.API.Models.ModelsAcademico;
using SUDENEXT.API.Models.ModelsPsicologia;
using SUDENEXT.BussinessLogic.Services.AcademicoServices;
using SUDENEXT.BussinessLogic.Services.PsicologiaServices;
using SUDENEXT.Entities.Entities;

namespace SUDENEXT.API.Controllers.ControllersPsicologia
{
    [Route("api/[controller]")]
    [ApiController]
    public class SolicitudApoyoController : Controller
    {
        private readonly PsicologiaService _psicologiaService;
        private readonly IMapper _mapper;

        public SolicitudApoyoController(PsicologiaService psicologiaService, IMapper mapper)
        {
            _psicologiaService = psicologiaService;
            _mapper = mapper;
        }


        [HttpGet("Listar")]
        public IActionResult Index()
        {
            var listado = _psicologiaService.ListadoSolicitudApoyoCompleto();
            listado.Data = _mapper.Map<IEnumerable<ListadoSolicitudApoyoViewModel>>(listado.Data);
            return Ok(listado);

        }

        [HttpGet("ListarTOP5")]
        public IActionResult ListadoTOP5(int est_ID)
        {
            tbSolicitudApoyo tbSolicitudApoyo = new tbSolicitudApoyo();
            tbSolicitudApoyo.est_ID = est_ID;
            var listado = _psicologiaService.ListadoSolicitudApoyoEstudiante(tbSolicitudApoyo);
            listado.Data = _mapper.Map<IEnumerable<ListadoSolicitudApoyoViewModel>>(listado.Data);
            return Ok(listado);

        }

        [HttpPost("Insertar")]
        public IActionResult Insert(SolicitudApoyoViewModel solicitudApoyoViewModel)
        {
            var item = _mapper.Map<tbSolicitudApoyo>(solicitudApoyoViewModel);
            var respuesta = _psicologiaService.CrearSolicitudApoyo(item);
            return Ok(respuesta);
        }

        [HttpPost("Editar")]
        public IActionResult Update(SolicitudApoyoViewModel solicitudApoyoViewModel)
        {
            var item = _mapper.Map<tbSolicitudApoyo>(solicitudApoyoViewModel);
            var respuesta = _psicologiaService.EditarSolicitudApoyo(item);
            return Ok(respuesta);
        }

        [HttpPost("Eliminar")]
        public IActionResult Delete(SolicitudApoyoViewModel solicitudApoyoViewModel)
        {
            var item = _mapper.Map<tbSolicitudApoyo>(solicitudApoyoViewModel);
            var respuesta = _psicologiaService.EliminarSolicitudApoyo(item);
            return Ok(respuesta);
        }
    }
}
