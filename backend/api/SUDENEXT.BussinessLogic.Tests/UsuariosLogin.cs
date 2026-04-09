using Moq;
using SUDENEXT.BussinessLogic.Services.AccesoServices;
using SUDENEXT.DataAccess.Repositories.Acce;
using SUDENEXT.Entities.DTO;
using SUDENEXT.Entities.Entities;
using Xunit;

namespace SUDENEXT.BussinessLogic.Tests
{
    public class UsuariosLogin
    {
        // Inicio de la prueba unitaria 1
        [Fact]
        public void UsuariosLogin_CredencialesCorrectas_RetornaOkConUsuario()
        {
            // Arrange: Preparar las dependencias y objetos válidos
            var mockUsuariosRepo = new Mock<UsuariosRepository>();
            var mockRolesRepo = new Mock<RolesRepository>();
            var mockRolesXPantallasRepo = new Mock<RolesXPantallasRepository>();

            var credenciales = new tbUsuarios
            {
                usu_Usuario = "luis.sab@unah.hn",
                usu_Contrasena = "0987654321"
            };
            
            var resultadoDelRepositorio = new UsuariosLoginResult
            {
                codeStatus = 1,
                messageStatus = "Inicio de sesión exitoso.",
                usu_ID = 1,
                usu_Usuario = "luis.sab@unah.hn",
                per_ID = 1,
                rol_ID = 1,
                rol_Descripcion = "Administrador",
                per_Nombres = "Luis Alejandro",
                per_Apellidos = "Sabillón Perez",
                per_EstadoCivil = "Soltero",
                per_Sexo = "Masculino",
                per_FechaNac = new DateTime(1995, 12, 12),
                per_Telefono = "98987575",
                per_Direccion = "Colonia Los Pinos, La Lima",
                per_Correo = "luis.sab@unah.hn",
                are_ID = 2,
                are_Nombre = "Psicología"
            };

            mockUsuariosRepo.Setup(repo => repo.Login(credenciales))
                        .Returns(resultadoDelRepositorio);

            var servicio = new AccesoService(
                mockUsuariosRepo.Object,
                mockRolesRepo.Object,
                mockRolesXPantallasRepo.Object
            );

            // Act: ejecutar el método a probar
            var resultado = servicio.UsuariosLogin(credenciales);

            // Assert: Verificar que lo devuelto sea correcto
            Assert.Equal(200, resultado.Code);
            Assert.True(resultado.Success);
            Assert.Equal("Operación completada exitosamente.", resultado.Message);
        }
        // Fin de la prueba unitaria 1
        [Fact]
        public void UsuariosLogin_CredencialesInvalidas_RetornaForbidden()
        {
            // Arrange
            var mockUsuariosRepo = new Mock<UsuariosRepository>();
            var mockRolesRepo = new Mock<RolesRepository>();
            var mockRolesXPantallasRepo = new Mock<RolesXPantallasRepository>();

            // Datos de entrada
            var credenciales = new tbUsuarios
            {
                usu_Usuario = "string",
                usu_Contrasena = "string"
            };

            // Resultado del repositorio
            var resultadoDelRepositorio = new UsuariosLoginResult
            {
                codeStatus = 0,
                messageStatus = "La cuenta no existe."
            };

            //Inyectamos las credenciales y el resultado esperado
            mockUsuariosRepo.Setup(repo => repo.Login(credenciales))
                            .Returns(resultadoDelRepositorio);

            // AccesoService con los mocks
            var servicio = new AccesoService(
                mockUsuariosRepo.Object,
                mockRolesRepo.Object,
                mockRolesXPantallasRepo.Object
            );

            // Act
            var resultado = servicio.UsuariosLogin(credenciales);

            // Assert
            Assert.Equal(203, resultado.Code);
            Assert.False(resultado.Success);
            Assert.Equal("La cuenta no existe.", resultado.Message);
        }
    }
}