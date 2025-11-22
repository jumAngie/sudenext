using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SUDENEXT.API.Models.ModelsAcceso;
using SUDENEXT.API.Models.ModelsGeneral;
using SUDENEXT.BussinessLogic.Services.AccesoServices;
using SUDENEXT.BussinessLogic.Services.GeneralServices;
using SUDENEXT.Entities.Entities;

namespace SUDENEXT.API.Controllers.ControllersAcceso
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : Controller
    {
        private readonly AccesoService _accesoService;
        private readonly IMapper _mapper;

        public UsuariosController(AccesoService accesoService, IMapper mapper)
        {
            _accesoService = accesoService;
            _mapper = mapper;
        }

        [HttpPost("Login")]
        public IActionResult InicioSesion(LoginUsuariosViewModel usuario)
        {
            var mapped = _mapper.Map<tbUsuarios>(usuario);
            var respuesta = _accesoService.UsuariosLogin(mapped);

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
