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

        [HttpGet("Listar")]
        public IActionResult Index()
        {
            var listado = _accesoService.ListadoUsuariosCompleto();
            listado.Data = _mapper.Map<IEnumerable<ListadoUsuariosViewModel>>(listado.Data);
            return Ok(listado);

        }

        [HttpPost("Insertar")]
        public IActionResult Insert(UsuariosViewModel usuariosViewModel)
        {
            var item = _mapper.Map<tbUsuarios>(usuariosViewModel);
            var respuesta = _accesoService.CrearUsuario(item);
            return Ok(respuesta);
        }

        [HttpPost("Editar")]
        public IActionResult Update(UsuariosViewModel usuariosViewModel)
        {
            var item = _mapper.Map<tbUsuarios>(usuariosViewModel);
            var respuesta = _accesoService.EditarUsuario(item);
            return Ok(respuesta);
        }

        [HttpPost("Eliminar")]
        public IActionResult Delete(UsuariosViewModel usuariosViewModel)
        {
            var item = _mapper.Map<tbUsuarios>(usuariosViewModel);
            var respuesta = _accesoService.EliminarUsuario(item);
            return Ok(respuesta);
        }

        [HttpPost("CambiarContra")]
        public IActionResult CambiarContrasena(UsuariosViewModel usuariosViewModel)
        {
            var item = _mapper.Map<tbUsuarios>(usuariosViewModel);
            var respuesta = _accesoService.CambiarContrasenia(item);
            return Ok(respuesta);
        }
    }
}
