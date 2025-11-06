---------------------------------------------------  SOLICITUD DE APOYO  -----------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
---LISTAR
CREATE OR ALTER PROCEDURE Psi.sp_ListarSolicitudApoyo
AS
BEGIN
	SET NOCOUNT ON;
	SELECT 
		-- Datos principales del tipo de consulta
		sol.sol_ID,
		sol.est_ID,
		est.est_NombreCompleto,
		sol.sol_ResumenSesion,
		sol.sol_MotivoConsulta,
		sol.sol_MalestarEmocional,
		sol.sol_Asistencia,
		sol.sol_HorarioPref,
		sol.sol_Estado,

		-- ======== DATOS DEL USUARIO CREADOR ========
		usuC.usu_ID AS usu_UsuarioCreacion,
		usuC.usu_Usuario AS Usuario_C,
		perC.per_ID AS ID_Creador,
		(perC.per_Nombres + ' ' + perC.per_Apellidos) AS NombreCompleto_C,
		sol.sol_FechaCreacion,

		-- ======== DATOS DEL USUARIO MODIFICADOR ========
		usuM.usu_ID AS usu_UsuarioModificacion,
		usuM.usu_Usuario AS Usuario_M,
		perM.per_ID AS ID_Modificador,
		(perM.per_Nombres + ' ' + perM.per_Apellidos) AS NombreCompleto_M,
		sol.sol_FechaModificacion,

		-- ======== DATOS DEL USUARIO ELIMINADOR ========
		usuE.usu_ID AS usu_UsuarioEliminacion,
		usuE.usu_Usuario AS Usuario_E,
		perE.per_ID AS ID_Eliminador,
		(perE.per_Nombres + ' ' + perE.per_Apellidos) AS NombreCompleto_E,
		sol.sol_FechaEliminacion

	FROM Psi.tbSolicitudApoyo sol
		INNER JOIN Gral.tbEstudiantes est ON sol.est_ID = est.est_ID
		-- JOIN con Usuario Creador
		INNER JOIN Acce.tbUsuarios usuC ON sol.usu_UsuarioCreacion = usuC.usu_ID
		INNER JOIN Gral.tbPersonal perC ON usuC.per_ID = perC.per_ID

		-- JOIN con Usuario Modificador
		LEFT JOIN Acce.tbUsuarios usuM ON sol.usu_UsuarioModificacion = usuM.usu_ID
		LEFT JOIN Gral.tbPersonal perM ON usuM.per_ID = perM.per_ID

		-- JOIN con Usuario Eliminador
		LEFT JOIN Acce.tbUsuarios usuE ON sol.usu_UsuarioEliminacion = usuE.usu_ID
		LEFT JOIN Gral.tbPersonal perE ON usuE.per_ID = perE.per_ID

	WHERE sol.sol_Estado = 1;
END;
GO

---CREAR
CREATE OR ALTER PROCEDURE Psi.sp_CrearSolicitudApoyo
	@est_ID	INT,
	@sol_ResumenSesion NVARCHAR(200),
	@sol_MotivoConsulta NVARCHAR(200),
	@sol_MalestarEmocional INT,
	@sol_Asistencia	BIT,
	@sol_HorarioPref	TIME,
	@usu_UsuarioCreacion INT,
	@sol_FechaCreacion DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		
		INSERT INTO Psi.tbSolicitudApoyo
		(est_ID, sol_ResumenSesion, sol_MotivoConsulta, sol_MalestarEmocional, sol_Asistencia, sol_HorarioPref, usu_UsuarioCreacion,sol_FechaCreacion)
		VALUES
		(@est_ID, @sol_ResumenSesion, @sol_MotivoConsulta, @sol_MalestarEmocional, @sol_Asistencia, @sol_HorarioPref, @usu_UsuarioCreacion,@sol_FechaCreacion);

		SELECT 'Registro creado correctamente.' AS MessageStatus;
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMsg NVARCHAR(4000) = ERROR_MESSAGE();
		SELECT CONCAT('Error al crear el registro: ', @ErrorMsg) AS MessageStatus;
		RETURN;
	END CATCH
END;
GO
----EDITAR
CREATE OR ALTER PROCEDURE Psi.sp_EditarSolicitudApoyo
	@sol_ID INT,
	@est_ID	INT,
	@sol_ResumenSesion NVARCHAR(200),
	@sol_MotivoConsulta NVARCHAR(200),
	@sol_MalestarEmocional INT,
	@sol_Asistencia	BIT,
	@sol_HorarioPref	TIME,
	@usu_UsuarioModificacion INT,
	@sol_FechaModificacion DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY

		UPDATE Psi.tbSolicitudApoyo
		SET est_ID = @est_ID,
			sol_ResumenSesion = @sol_ResumenSesion,
			sol_MotivoConsulta = @sol_MotivoConsulta, 
			sol_MalestarEmocional = @sol_MalestarEmocional, 
			sol_Asistencia = @sol_Asistencia, 
			sol_HorarioPref = @sol_HorarioPref,
			usu_UsuarioModificacion = @usu_UsuarioModificacion,
			sol_FechaModificacion = @sol_FechaModificacion
		WHERE sol_ID = @sol_ID;

		SELECT 'Registro actualizado correctamente.' AS MessageStatus;
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMsg NVARCHAR(4000) = ERROR_MESSAGE();
		SELECT CONCAT('Error al editar el registro: ', @ErrorMsg) AS MessageStatus;
	RETURN;
	END CATCH
END;
GO
---ELIMINAR
CREATE OR ALTER PROCEDURE Psi.sp_EliminarSolicitudApoyo
	@sol_ID INT,
	@usu_UsuarioEliminacion INT,
	@sol_FechaEliminacion DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		-- Validar existencia activa
		IF NOT EXISTS (SELECT 1 FROM Psi.tbSolicitudApoyo WHERE sol_ID = @sol_ID AND sol_Estado = 1)
		BEGIN
			SELECT 'El registro no existe o ya fue eliminado.' AS MessageStatus;
			RETURN;
		END

		UPDATE Psi.tbSolicitudApoyo
		SET sol_Estado = 0,
			usu_UsuarioEliminacion = @usu_UsuarioEliminacion,
			sol_FechaEliminacion = @sol_FechaEliminacion
		WHERE sol_ID = @sol_ID;

		SELECT 'Registro eliminado exitosamente.' AS MessageStatus;
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMsg NVARCHAR(4000) = ERROR_MESSAGE();
		SELECT CONCAT('Error al eliminar el registro: ', @ErrorMsg) AS MessageStatus;
		RETURN;
	END CATCH
END;
GO