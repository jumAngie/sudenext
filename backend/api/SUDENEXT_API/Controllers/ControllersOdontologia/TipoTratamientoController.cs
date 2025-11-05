using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SUDENEXT.API.Models.ModelsGeneral;
using SUDENEXT.API.Models.ModelsOdontologia;
using SUDENEXT.BussinessLogic.Services.GeneralServices;
using SUDENEXT.BussinessLogic.Services.OdontologiaServices;
using SUDENEXT.Entities.Entities;

namespace SUDENEXT.API.Controllers.ControllersOdontologia
{
    [Route("api/[controller]")]
    [ApiController]
    public class TipoTratamientoController : Controller
    {
        private readonly OdontologiaService _odontologiaService;
        private readonly IMapper _mapper;

        public TipoTratamientoController(OdontologiaService odontologiaService, IMapper mapper)
        {
            _odontologiaService = odontologiaService;
            _mapper = mapper;
        }

        [HttpGet("Listar")]
        public IActionResult Index()
        {
            var listado = _odontologiaService.ListadoTipoTratamientoCompleto();
            listado.Data = _mapper.Map<IEnumerable<ListadoTipoTratamientoViewModel>>(listado.Data);
            return Ok(listado);

        }

        [HttpPost("Insertar")]
        public IActionResult Insert(TipoTratamientoViewMoel tipoTratamientoViewMoel)
        {
            var item = _mapper.Map<tbTratamientos>(tipoTratamientoViewMoel);
            var respuesta = _odontologiaService.CrearTipoTratamiento(item);
            return Ok(respuesta);
        }

        [HttpPost("Editar")]
        public IActionResult Update(TipoTratamientoViewMoel tipoTratamientoViewMoel)
        {
            var item = _mapper.Map<tbTratamientos>(tipoTratamientoViewMoel);
            var respuesta = _odontologiaService.EditarTipoTratamiento(item);
            return Ok(respuesta);
        }

        [HttpPost("Eliminar")]
        public IActionResult Delete(TipoTratamientoViewMoel tipoTratamientoViewMoel)
        {
            var item = _mapper.Map<tbTratamientos>(tipoTratamientoViewMoel);
            var respuesta = _odontologiaService.EliminarTipoTratamiento(item);
            return Ok(respuesta);
        }
    }
}
