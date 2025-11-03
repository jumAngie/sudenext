using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SUDENEXT.API.Models.ModelsGeneral;
using SUDENEXT.BussinessLogic.Services.GeneralServices;
using SUDENEXT.Entities.DTO;

namespace SUDENEXT.API.Controllers.ControllersGeneral
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonalController : Controller
    {
        private readonly  GeneralService _generalService;
        private readonly IMapper _mapper;

        public PersonalController(GeneralService generalService, IMapper mapper)
        {
            _generalService = generalService;
            _mapper = mapper;
        }

        [HttpGet("Listar")]
         public IActionResult Index()
         {
             var listado = _generalService.ListadoPersonalCompleto();
             listado.Data = _mapper.Map<IEnumerable<ListadoPersonalViewModel>>(listado.Data);
             return Ok(listado);

         }
    }
}
