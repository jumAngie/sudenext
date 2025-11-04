using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SUDENEXT.API.Models.ModelsGeneral;
using SUDENEXT.BussinessLogic.Services.GeneralServices;
using SUDENEXT.Entities.Entities;

namespace SUDENEXT.API.Controllers.ControllersGeneral
{
    [Route("api/[controller]")]
    [ApiController]
    public class AreasController : Controller
    {
        private readonly GeneralService _generalService;
        private readonly IMapper _mapper;

        public AreasController(GeneralService generalService, IMapper mapper)
        {
            _generalService = generalService;
            _mapper = mapper;
        }

        [HttpGet("Listar")]
        public IActionResult Index()
        {
            var listado = _generalService.ListadoAreasCompleto();
            listado.Data = _mapper.Map<IEnumerable<ListadoAreasViewModel>>(listado.Data);
            return Ok(listado);

        }

        [HttpPost("Insertar")]
        public IActionResult Insert(AreasViewModel areasViewModel)
        {
            var item = _mapper.Map<tbAreas>(areasViewModel);
            var respuesta = _generalService.CrearAreas(item);
            return Ok(respuesta);
        }

        [HttpPost("Editar")]
        public IActionResult Update(AreasViewModel areasViewModel)
        {
            var item = _mapper.Map<tbAreas>(areasViewModel);
            var respuesta = _generalService.EditarAreas(item);
            return Ok(respuesta);
        }

        [HttpPost("Eliminar")]
        public IActionResult Delete(AreasViewModel areasViewModel)
        {
            var item = _mapper.Map<tbAreas>(areasViewModel);
            var respuesta = _generalService.EliminarAreas(item);
            return Ok(respuesta);
        }
    }
}
