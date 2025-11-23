using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SUDENEXT.API.Models.ModelsAcceso;
using SUDENEXT.BussinessLogic.Services.AccesoServices;
using SUDENEXT.Entities.Entities;

namespace SUDENEXT.API.Controllers.ControllersAcceso
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : Controller
    {
        private readonly AccesoService _accesoService;
        private readonly IMapper _mapper;

        public RolesController(AccesoService accesoService, IMapper mapper)
        {
            _accesoService = accesoService;
            _mapper = mapper;
        }

        [HttpGet("Listar")]
        public IActionResult Index()
        {
            var listado = _accesoService.ListadoRolesCompleto();
            listado.Data = _mapper.Map<IEnumerable<ListadoRolesViewModel>>(listado.Data);
            return Ok(listado);

        }

        [HttpPost("Insertar")]
        public IActionResult Insert(RolesViewModel rolesView)
        {
            var item = _mapper.Map<tbRoles>(rolesView);
            var respuesta = _accesoService.CrearRol(item);
            return Ok(respuesta);
        }

        [HttpPost("Editar")]
        public IActionResult Update(RolesViewModel rolesView)
        {
            var item = _mapper.Map<tbRoles>(rolesView);
            var respuesta = _accesoService.EditarRol(item);
            return Ok(respuesta);
        }

        [HttpPost("Eliminar")]
        public IActionResult Delete(RolesViewModel rolesView)
        {
            var item = _mapper.Map<tbRoles>(rolesView);
            var respuesta = _accesoService.EliminarRoles(item);
            return Ok(respuesta);
        }
    }
}
