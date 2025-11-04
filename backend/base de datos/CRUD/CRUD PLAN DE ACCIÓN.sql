---------------------------------------------------  PLAN DE ACCIÓN  -----------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
---LISTAR
CREATE OR ALTER PROCEDURE Psi.sp_ListarPlanAccion
AS
BEGIN
	SET NOCOUNT ON;
	SELECT 
		-- Datos principales del tipo de consulta
		pla.pla_ID,
		pla.pla_ResumenSesion,
		pla.pla_Objetivo,
		pla.pla_ActividadSug,
		pla.pla_FechaSeguimiento,
		pla.pla_Observacion,
		pla.pla_Estado,

		-- ======== DATOS DEL USUARIO CREADOR ========
		usuC.usu_ID AS usu_UsuarioCreacion,
		usuC.usu_Usuario AS Usuario_C,
		perC.per_ID AS ID_Creador,
		(perC.per_Nombres + ' ' + perC.per_Apellidos) AS NombreCompleto_C,
		pla.pla_FechaCreacion,

		-- ======== DATOS DEL USUARIO MODIFICADOR ========
		usuM.usu_ID AS usu_UsuarioModificacion,
		usuM.usu_Usuario AS Usuario_M,
		perM.per_ID AS ID_Modificador,
		(perM.per_Nombres + ' ' + perM.per_Apellidos) AS NombreCompleto_M,
		pla.pla_FechaModificacion,

		-- ======== DATOS DEL USUARIO ELIMINADOR ========
		usuE.usu_ID AS usu_UsuarioEliminacion,
		usuE.usu_Usuario AS Usuario_E,
		perE.per_ID AS ID_Eliminador,
		(perE.per_Nombres + ' ' + perE.per_Apellidos) AS NombreCompleto_E,
		pla.pla_FechaEliminacion

	FROM Psi.tbPlanAccion pla
		-- JOIN con Usuario Creador
		INNER JOIN Acce.tbUsuarios usuC ON pla.usu_UsuarioCreacion = usuC.usu_ID
		INNER JOIN Gral.tbPersonal perC ON usuC.per_ID = perC.per_ID

		-- JOIN con Usuario Modificador
		LEFT JOIN Acce.tbUsuarios usuM ON pla.usu_UsuarioModificacion = usuM.usu_ID
		LEFT JOIN Gral.tbPersonal perM ON usuM.per_ID = perM.per_ID

		-- JOIN con Usuario Eliminador
		LEFT JOIN Acce.tbUsuarios usuE ON pla.usu_UsuarioEliminacion = usuE.usu_ID
		LEFT JOIN Gral.tbPersonal perE ON usuE.per_ID = perE.per_ID

	WHERE pla.pla_Estado = 1;
END;
GO

---CREAR
CREATE OR ALTER PROCEDURE Psi.sp_CrearPlanAccion
	@pla_ResumenSesion NVARCHAR(200),
	@pla_Objetivo NVARCHAR(200),
	@pla_ActividadSug NVARCHAR(200),
	@pla_FechaSeguimiento	DATE,
	@pla_Observacion	NVARCHAR(200),
	@usu_UsuarioCreacion INT,
	@pla_FechaCreacion DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		
		INSERT INTO Psi.tbPlanAccion
		(pla_ResumenSesion, pla_Objetivo, pla_ActividadSug, pla_FechaSeguimiento, pla_Observacion,usu_UsuarioCreacion,pla_FechaCreacion)
		VALUES
		(@pla_ResumenSesion, @pla_Objetivo, @pla_ActividadSug, @pla_FechaSeguimiento, @pla_Observacion, @usu_UsuarioCreacion,@pla_FechaCreacion);

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
CREATE OR ALTER PROCEDURE Psi.sp_EditarPlanAccion
	@pla_ID INT,
	@pla_ResumenSesion NVARCHAR(200),
	@pla_Objetivo NVARCHAR(200),
	@pla_ActividadSug NVARCHAR(200),
	@pla_FechaSeguimiento	DATE,
	@pla_Observacion	NVARCHAR(200),
	@usu_UsuarioModificacion INT,
	@pla_FechaModificacion DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		
		UPDATE Psi.tbPlanAccion
		SET pla_ResumenSesion = @pla_ResumenSesion,
			pla_Objetivo = @pla_Objetivo, 
			pla_ActividadSug = @pla_ActividadSug, 
			pla_FechaSeguimiento = @pla_FechaSeguimiento, 
			pla_Observacion = @pla_Observacion, 
			usu_UsuarioModificacion = @usu_UsuarioModificacion,
			pla_FechaModificacion = @pla_FechaModificacion
		WHERE pla_ID = @pla_ID;

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
CREATE OR ALTER PROCEDURE Psi.sp_EliminarPlanAccion
	@pla_ID INT,
	@usu_UsuarioEliminacion INT,
	@pla_FechaEliminacion DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		-- Validar existencia activa
		IF NOT EXISTS (SELECT 1 FROM Psi.tbPlanAccion WHERE pla_ID = @pla_ID AND pla_Estado = 1)
		BEGIN
			SELECT 'El registro no existe o ya fue eliminado.' AS MessageStatus;
			RETURN;
		END

		UPDATE Psi.tbPlanAccion
		SET pla_Estado = 0,
			usu_UsuarioEliminacion = @usu_UsuarioEliminacion,
			pla_FechaEliminacion = @pla_FechaEliminacion
		WHERE pla_ID = @pla_ID;

		SELECT 'Registro eliminado exitosamente.' AS MessageStatus;
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMsg NVARCHAR(4000) = ERROR_MESSAGE();
		SELECT CONCAT('Error al eliminar el registro: ', @ErrorMsg) AS MessageStatus;
		RETURN;
	END CATCH
END;
GO