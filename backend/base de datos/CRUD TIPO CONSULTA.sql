---------------------------------------------------  TIPO CONSULTA  -----------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
---LISTAR
CREATE OR ALTER PROCEDURE Acad.sp_ListarTipoConsulta
AS
BEGIN
	SET NOCOUNT ON;

	SELECT 
		-- Datos principales del tipo de consulta
		acad.tic_ID,
		acad.tic_Descripcion,
		acad.tic_Estado,

		-- ======== DATOS DEL USUARIO CREADOR ========
		usuC.usu_ID AS usu_UsuarioCreacion,
		usuC.usu_Usuario AS Usuario_C,
		perC.per_ID AS ID_Creador,
		(perC.per_Nombres + ' ' + perC.per_Apellidos) AS NombreCompleto_C,
		acad.tic_FechaCreacion,

		-- ======== DATOS DEL USUARIO MODIFICADOR ========
		usuM.usu_ID AS usu_UsuarioModificacion,
		usuM.usu_Usuario AS Usuario_M,
		perM.per_ID AS ID_Modificador,
		(perM.per_Nombres + ' ' + perM.per_Apellidos) AS NombreCompleto_M,
		acad.tic_FechaModificacion,

		-- ======== DATOS DEL USUARIO ELIMINADOR ========
		usuE.usu_ID AS usu_UsuarioEliminacion,
		usuE.usu_Usuario AS Usuario_E,
		perE.per_ID AS ID_Eliminador,
		(perE.per_Nombres + ' ' + perE.per_Apellidos) AS NombreCompleto_E,
		acad.tic_FechaEliminacion

	FROM Acad.tbTipoConsulta acad
		-- JOIN con Usuario Creador
		INNER JOIN Acce.tbUsuarios usuC ON acad.usu_UsuarioCreacion = usuC.usu_ID
		INNER JOIN Gral.tbPersonal perC ON usuC.per_ID = perC.per_ID

		-- JOIN con Usuario Modificador
		LEFT JOIN Acce.tbUsuarios usuM ON acad.usu_UsuarioModificacion = usuM.usu_ID
		LEFT JOIN Gral.tbPersonal perM ON usuM.per_ID = perM.per_ID

		-- JOIN con Usuario Eliminador
		LEFT JOIN Acce.tbUsuarios usuE ON acad.usu_UsuarioEliminacion = usuE.usu_ID
		LEFT JOIN Gral.tbPersonal perE ON usuE.per_ID = perE.per_ID

	WHERE acad.tic_Estado = 1;
END;
GO


---CREAR
CREATE OR ALTER PROCEDURE Acad.sp_CrearTipoConsulta
	@tic_Descripcion NVARCHAR(80),
	@usu_UsuarioCreacion INT,
	@tic_FechaCreacion DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		-- Validar que no exista duplicado 
		IF EXISTS (SELECT 1 FROM Acad.tbTipoConsulta
				   WHERE tic_Descripcion = @tic_Descripcion
				   AND tic_Estado = 1)
		BEGIN
			SELECT 'El registro ya existe.' AS MessageStatus;
			RETURN;
		END
		INSERT INTO Acad.tbTipoConsulta
		(tic_Descripcion,usu_UsuarioCreacion,tic_FechaCreacion)
		VALUES
		(@tic_Descripcion,@usu_UsuarioCreacion,@tic_FechaCreacion);

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
CREATE OR ALTER PROCEDURE Acad.sp_EditarTipoConsulta
	@tic_ID INT,
	@tic_Descripcion NVARCHAR(80),
	@usu_UsuarioModificacion INT,
	@tic_FechaModificacion DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		-- Validar existencia
		IF NOT EXISTS (SELECT 1 FROM Acad.tbTipoConsulta WHERE tic_ID = @tic_ID AND tic_Estado = 1)
		BEGIN
			SELECT 'No se encontró el registro activo con el ID especificado.' AS MessageStatus;
			RETURN;
		END
		UPDATE Acad.tbTipoConsulta
		SET tic_Descripcion = @tic_Descripcion,
			usu_UsuarioModificacion = @usu_UsuarioModificacion,
			tic_FechaModificacion = @tic_FechaModificacion
		WHERE tic_ID = @tic_ID;

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
CREATE OR ALTER PROCEDURE Gral.sp_EliminarArea
	@are_ID INT,
	@usu_UsuarioEliminacion INT,
	@are_FechaEliminacion DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		-- Validar existencia activa
		IF NOT EXISTS (SELECT 1 FROM Gral.tbAreas WHERE are_ID = @are_ID AND are_Estado = 1)
		BEGIN
			SELECT 'El registro no existe o ya fue eliminado.' AS MessageStatus;
			RETURN;
		END

		UPDATE Gral.tbAreas
		SET are_Estado = 0,
			usu_UsuarioEliminacion = @usu_UsuarioEliminacion,
			are_FechaEliminacion = @are_FechaEliminacion
		WHERE are_ID = @are_ID;

		SELECT 'Registro eliminado exitosamente.' AS MessageStatus;
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMsg NVARCHAR(4000) = ERROR_MESSAGE();
		SELECT CONCAT('Error al eliminar el registro: ', @ErrorMsg) AS MessageStatus;
		RETURN;
	END CATCH
END;
GO