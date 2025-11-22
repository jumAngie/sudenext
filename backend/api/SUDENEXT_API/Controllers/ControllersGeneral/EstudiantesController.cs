using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SUDENEXT.API.Models.ModelsGeneral;
using SUDENEXT.BussinessLogic.Services.AccesoServices;
using SUDENEXT.BussinessLogic.Services.GeneralServices;
using SUDENEXT.Entities.Entities;

namespace SUDENEXT.API.Controllers.ControllersGeneral
{
    [Route("api/[controller]")]
    [ApiController]
    public class EstudiantesController : Controller
    {
        private readonly GeneralService _generalService;
        private readonly IMapper _mapper;

        public EstudiantesController(GeneralService generalService, IMapper mapper)
        {
            _generalService = generalService;
            _mapper = mapper;
        }

        [HttpPost("Login")]
        public IActionResult InicioSesion(LoginEstudiantesViewModel estudiante)
        {
            var mapped = _mapper.Map<tbEstudiantes>(estudiante);
            var respuesta = _generalService.EstudiantesLogin(mapped);

            if (respuesta.Code == 200)
            {
                return Ok(respuesta);
            }
            else
            {
                return StatusCode(203, respuesta);
            }

        }
    }
}
