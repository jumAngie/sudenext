using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SUDENEXT.API.Models.ModelsAcademico;
using SUDENEXT.BussinessLogic.Services.AcademicoServices;
using SUDENEXT.Entities.Entities;

namespace SUDENEXT.API.Controllers.ControllersAcademico
{
    [Route("api/[controller]")]
    [ApiController]
    public class TipoConsultaController : Controller
    {
        private readonly AcademicoService _academicoService;
        private readonly IMapper _mapper;
        
        public TipoConsultaController(AcademicoService academicoService, IMapper mapper)
        {
            _academicoService = academicoService;
            _mapper = mapper;
        }

        [HttpGet("Listar")]
        public IActionResult Index()
        {
            var listado = _academicoService.ListadoTipoConsultaCompleto();
            listado.Data = _mapper.Map<IEnumerable<ListadoTipoConsultaViewModel>>(listado.Data);
            return Ok(listado);

        }

        [HttpPost("Insertar")]
        public IActionResult Insert(TipoConsultaViewModel tipoConsultaViewModel)
        {
            var item = _mapper.Map<tbTipoConsulta>(tipoConsultaViewModel);
            var respuesta = _academicoService.CrearTipoConsulta(item);
            return Ok(respuesta);
        }

        [HttpPost("Editar")]
        public IActionResult Update(TipoConsultaViewModel tipoConsultaViewModel)
        {
            var item = _mapper.Map<tbTipoConsulta>(tipoConsultaViewModel);
            var respuesta = _academicoService.EditarTipoConsulta(item);
            return Ok(respuesta);
        }

        [HttpPost("Eliminar")]
        public IActionResult Delete(TipoConsultaViewModel tipoConsultaViewModel)
        {
            var item = _mapper.Map<tbTipoConsulta>(tipoConsultaViewModel);
            var respuesta = _academicoService.EliminarTipoConsulta(item);
            return Ok(respuesta);
        }
    }
}
