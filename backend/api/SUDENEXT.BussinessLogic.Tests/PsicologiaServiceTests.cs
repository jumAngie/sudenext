using Moq;
using SUDENEXT.BussinessLogic.Services.PsicologiaServices;
using SUDENEXT.DataAccess;
using SUDENEXT.DataAccess.Repositories.Psi;
using SUDENEXT.Entities.DTO;
using SUDENEXT.Entities.Entities;
using Xunit;

namespace SUDENEXT.BussinessLogic.Tests
{

    public class PsicologiaServiceTests
    {
        [Fact]
        public void ListadoPlanAccionCompleto_ConDatos_RetornaOk()
        {
            // Arrange
            var mockPlanAccionRepo = new Mock<PlanAccionRepository>();
            var mockSolicitudApoyoRepo = new Mock<SolicitudApoyoRepository>();
            var mockSolicitudesXPlanesRepo = new Mock<SolicitudesXPlanesRepository>();
            var mockSolicitudApoyoAsignadaRepo = new Mock<SolicitudApoyoAsignadaRepository>();

            var listaMock = new List<ListadoPlanAccionDTO>
            {
                new ListadoPlanAccionDTO(),
                new ListadoPlanAccionDTO()
            };

            mockPlanAccionRepo
                .Setup(repo => repo.ListadoCompleto())
                .Returns(listaMock);

            var servicio = new PsicologiaService(
                mockPlanAccionRepo.Object,
                mockSolicitudApoyoRepo.Object,
                mockSolicitudesXPlanesRepo.Object,
                mockSolicitudApoyoAsignadaRepo.Object
            );

            // Act
            var resultado = servicio.ListadoPlanAccionCompleto();

            // Assert
            Assert.Equal(200, resultado.Code);
            Assert.True(resultado.Success);
            Assert.Equal("Operación completada exitosamente.", resultado.Message);
        }

        [Fact]
        public void ListadoPlanAccionCompleto_ErrorEnRepositorio_RetornaError()
        {
            // Arrange
            var mockPlanAccionRepo = new Mock<PlanAccionRepository>();
            var mockSolicitudApoyoRepo = new Mock<SolicitudApoyoRepository>();
            var mockSolicitudesXPlanesRepo = new Mock<SolicitudesXPlanesRepository>();
            var mockSolicitudApoyoAsignadaRepo = new Mock<SolicitudApoyoAsignadaRepository>();

            mockPlanAccionRepo
                .Setup(repo => repo.ListadoCompleto())
                .Throws(new Exception("Error al listar planes de acción."));

            var servicio = new PsicologiaService(
                mockPlanAccionRepo.Object,
                mockSolicitudApoyoRepo.Object,
                mockSolicitudesXPlanesRepo.Object,
                mockSolicitudApoyoAsignadaRepo.Object
            );

            // Act
            var resultado = servicio.ListadoPlanAccionCompleto();

            // Assert
            Assert.False(resultado.Success);
            Assert.Equal("Error al listar planes de acción.", resultado.Message);
        }

        [Fact]
        public void CrearPlanAccion_DatosCorrectos_RetornaOk()
        {
            // Arrange
            var mockPlanAccionRepo = new Mock<PlanAccionRepository>();
            var mockSolicitudApoyoRepo = new Mock<SolicitudApoyoRepository>();
            var mockSolicitudesXPlanesRepo = new Mock<SolicitudesXPlanesRepository>();
            var mockSolicitudApoyoAsignadaRepo = new Mock<SolicitudApoyoAsignadaRepository>();

            var nuevoPlan = new tbPlanAccion
            {
                spa_Id = 1,
                pla_ResumenSesion = "Se trabajó control emocional",
                pla_Objetivo = "Reducir ansiedad académica",
                pla_ActividadSug = "Ejercicios de respiración",
                pla_FechaSeguimiento = DateTime.Now.AddDays(7),
                pla_Observacion = "Paciente colaboró bien",
                usu_UsuarioCreacion = 1,
                pla_FechaCreacion = DateTime.Now
            };

            var respuestaMock = new RequestStatus
            {
                MessageStatus = "Registro insertado correctamente."
            };

            mockPlanAccionRepo
                .Setup(repo => repo.Insert(nuevoPlan))
                .Returns(respuestaMock);

            var servicio = new PsicologiaService(
                mockPlanAccionRepo.Object,
                mockSolicitudApoyoRepo.Object,
                mockSolicitudesXPlanesRepo.Object,
                mockSolicitudApoyoAsignadaRepo.Object
            );

            // Act
            var resultado = servicio.CrearPlanAccion(nuevoPlan);

            // Assert
            Assert.Equal(200, resultado.Code);
            Assert.True(resultado.Success);
            Assert.Equal("Operación completada exitosamente.", resultado.Message);
        }

        [Fact]
        public void CrearPlanAccion_ErrorEnRepositorio_RetornaError()
        {
            // Arrange
            var mockPlanAccionRepo = new Mock<PlanAccionRepository>();
            var mockSolicitudApoyoRepo = new Mock<SolicitudApoyoRepository>();
            var mockSolicitudesXPlanesRepo = new Mock<SolicitudesXPlanesRepository>();
            var mockSolicitudApoyoAsignadaRepo = new Mock<SolicitudApoyoAsignadaRepository>();

            var nuevoPlan = new tbPlanAccion
            {
                spa_Id = 1,
                pla_ResumenSesion = "Se trabajó control emocional",
                pla_Objetivo = "Reducir ansiedad académica",
                pla_ActividadSug = "Ejercicios de respiración",
                pla_FechaSeguimiento = DateTime.Now.AddDays(7),
                pla_Observacion = "Paciente colaboró bien",
                usu_UsuarioCreacion = 1,
                pla_FechaCreacion = DateTime.Now
            };

            mockPlanAccionRepo
                .Setup(repo => repo.Insert(nuevoPlan))
                .Throws(new Exception("Error al crear el plan de acción."));

            var servicio = new PsicologiaService(
                mockPlanAccionRepo.Object,
                mockSolicitudApoyoRepo.Object,
                mockSolicitudesXPlanesRepo.Object,
                mockSolicitudApoyoAsignadaRepo.Object
            );

            // Act
            var resultado = servicio.CrearPlanAccion(nuevoPlan);

            // Assert
            Assert.False(resultado.Success);
            Assert.Equal("Error al crear el plan de acción.", resultado.Message);
        }
    }
}
