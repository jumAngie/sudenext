using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SUDENEXT.API.Models.ModelsAcademico;
using SUDENEXT.API.Models.ModelsGeneral;
using SUDENEXT.BussinessLogic.Services.AcademicoServices;
using SUDENEXT.BussinessLogic.Services.GeneralServices;
using SUDENEXT.Entities.Entities;

namespace SUDENEXT.API.Controllers.ControllersAcademico
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConsultaAcademicasController : Controller
    {
        private readonly AcademicoService _academicoService;
        private readonly IMapper _mapper;
        int prueba = ;
        public ConsultaAcademicasController(AcademicoService academicoService, IMapper mapper)
        {
            _academicoService = academicoService;
            _mapper = mapper;
        }

        [HttpGet("Listar")]
        public IActionResult Index()
        {
            var listado = _academicoService.ListadoConsultasAcademicasCompleto();
            listado.Data = _mapper.Map<IEnumerable<ListadoConsultaAcademicasViewModel>>(listado.Data);
            return Ok(listado);

        }

        [HttpPost("Insertar")]
        public IActionResult Insert(ConsultaAcademicasViewModel consultaAcademicasViewModel)
        {
            var item = _mapper.Map<tbConsultasAcademicas>(consultaAcademicasViewModel);
            var respuesta = _academicoService.CrearConsultaAcademicas(item);
            return Ok(respuesta);
        }

        [HttpPost("Editar")]
        public IActionResult Update(ConsultaAcademicasViewModel consultaAcademicasViewModel)
        {
            var item = _mapper.Map<tbConsultasAcademicas>(consultaAcademicasViewModel);
            var respuesta = _academicoService.EditarConsultaAcademicas(item);
            return Ok(respuesta);
        }

        [HttpPost("Eliminar")]
        public IActionResult Delete(ConsultaAcademicasViewModel consultaAcademicasViewModel)
        {
            var item = _mapper.Map<tbConsultasAcademicas>(consultaAcademicasViewModel);
            var respuesta = _academicoService.EliminarConsultaAcademicas(item);
            return Ok(respuesta);
        }
    }
}
