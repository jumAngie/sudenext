using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SUDENEXT.API.Models.ModelsOdontologia;
using SUDENEXT.BussinessLogic.Services.OdontologiaServices;
using SUDENEXT.Entities.Entities;

namespace SUDENEXT.API.Controllers.ControllersOdontologia
{
    [Route("api/[controller]")]
    [ApiController]
    public class DiagnosticoOdontoController : Controller
    {
        private readonly OdontologiaService _odontologiaService;
        private readonly IMapper _mapper;

        public DiagnosticoOdontoController(OdontologiaService odontologiaService, IMapper mapper)
        {
            _odontologiaService = odontologiaService;
            _mapper = mapper;
        }

        [HttpGet("Listar")]
        public IActionResult Index()
        {
            var listado = _odontologiaService.ListadoDiagnosticoOdonto();
            listado.Data = _mapper.Map<IEnumerable<ListadoDiagnosticoOdontoViewModel>>(listado.Data);
            return Ok(listado);

        }

        [HttpPost("Insertar")]
        public IActionResult Insert(DiagnosticoOdontoViewModel diagnosticoOdontoView)
        {
            var item = _mapper.Map<tbDiagnosticoOdonto>(diagnosticoOdontoView);
            var respuesta = _odontologiaService.CrearDiagnosticoOdon(item);
            return Ok(respuesta);
        }
    }
     
}
