using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SUDENEXT.API.Models.ModelsPsicologia;
using SUDENEXT.BussinessLogic.Services.PsicologiaServices;
using SUDENEXT.Entities.Entities;

namespace SUDENEXT.API.Controllers.ControllersPsicologia
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlanAccionController : Controller
    {
        private readonly PsicologiaService _psicologiaService;
        private readonly IMapper _mapper;

        public PlanAccionController(PsicologiaService psicologiaService, IMapper mapper)
        {
            _psicologiaService = psicologiaService;
            _mapper = mapper;
        }

        [HttpGet("Listar")]
        public IActionResult Index()
        {
            var listado = _psicologiaService.ListadoPlanAccionCompleto();
            listado.Data = _mapper.Map<IEnumerable<ListadoPlanAccionViewModel>>(listado.Data);
            return Ok(listado);

        }

        [HttpPost("Insertar")]
        public IActionResult Insert(PlanAccionViewModel planAccionViewModel)
        {
            var item = _mapper.Map<tbPlanAccion>(planAccionViewModel);
            var respuesta = _psicologiaService.CrearPlanAccion(item);
            return Ok(respuesta);
        }

        [HttpPost("Editar")]
        public IActionResult Update(PlanAccionViewModel planAccionViewModel)
        {
            var item = _mapper.Map<tbPlanAccion>(planAccionViewModel);
            var respuesta = _psicologiaService.EditarPlanAccion(item);
            return Ok(respuesta);
        }

        [HttpPost("Eliminar")]
        public IActionResult Delete(PlanAccionViewModel planAccionViewModel)
        {
            var item = _mapper.Map<tbPlanAccion>(planAccionViewModel);
            var respuesta = _psicologiaService.EliminarPlanAccion(item);
            return Ok(respuesta);
        }
    }
}
