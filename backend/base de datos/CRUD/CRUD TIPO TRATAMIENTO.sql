---------------------------------------------------  TIPO TRATAMIENTO  -----------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
---LISTAR
CREATE OR ALTER PROCEDURE Odon.sp_ListarTipoTratamiento
AS
BEGIN
	SET NOCOUNT ON;
	SELECT 
		-- Datos principales del tipo de consulta
		tra.tra_ID,
		tra.tra_Descripcion,
		tra.tra_Estado,

		-- ======== DATOS DEL USUARIO CREADOR ========
		usuC.usu_ID AS usu_UsuarioCreacion,
		usuC.usu_Usuario AS Usuario_C,
		perC.per_ID AS ID_Creador,
		(perC.per_Nombres + ' ' + perC.per_Apellidos) AS NombreCompleto_C,
		tra.tra_FechaCreacion,

		-- ======== DATOS DEL USUARIO MODIFICADOR ========
		usuM.usu_ID AS usu_UsuarioModificacion,
		usuM.usu_Usuario AS Usuario_M,
		perM.per_ID AS ID_Modificador,
		(perM.per_Nombres + ' ' + perM.per_Apellidos) AS NombreCompleto_M,
		tra.tra_FechaModificacion,

		-- ======== DATOS DEL USUARIO ELIMINADOR ========
		usuE.usu_ID AS usu_UsuarioEliminacion,
		usuE.usu_Usuario AS Usuario_E,
		perE.per_ID AS ID_Eliminador,
		(perE.per_Nombres + ' ' + perE.per_Apellidos) AS NombreCompleto_E,
		tra.tra_FechaEliminacion

	FROM Odon.tbTratamientos tra
		-- JOIN con Usuario Creador
		INNER JOIN Acce.tbUsuarios usuC ON tra.usu_UsuarioCreacion = usuC.usu_ID
		INNER JOIN Gral.tbPersonal perC ON usuC.per_ID = perC.per_ID

		-- JOIN con Usuario Modificador
		LEFT JOIN Acce.tbUsuarios usuM ON tra.usu_UsuarioModificacion = usuM.usu_ID
		LEFT JOIN Gral.tbPersonal perM ON usuM.per_ID = perM.per_ID

		-- JOIN con Usuario Eliminador
		LEFT JOIN Acce.tbUsuarios usuE ON tra.usu_UsuarioEliminacion = usuE.usu_ID
		LEFT JOIN Gral.tbPersonal perE ON usuE.per_ID = perE.per_ID

	WHERE tra.tra_Estado = 1;
END;
GO


---CREAR
CREATE OR ALTER PROCEDURE Odon.sp_CrearTipoTratamiento
	@tra_Descripcion NVARCHAR(80),
	@usu_UsuarioCreacion INT,
	@tra_FechaCreacion DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		-- Validar que no exista duplicado 
		IF EXISTS (SELECT 1 FROM Odon.tbTratamientos
				   WHERE tra_Descripcion = @tra_Descripcion
				   AND tra_Estado = 1)
		BEGIN
			SELECT 'El registro ya existe.' AS MessageStatus;
			RETURN;
		END
		INSERT INTO Odon.tbTratamientos
		(tra_Descripcion,usu_UsuarioCreacion,tra_FechaCreacion)
		VALUES
		(@tra_Descripcion,@usu_UsuarioCreacion,@tra_FechaCreacion);

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
CREATE OR ALTER PROCEDURE Odon.sp_EditarTipoTratamiento
	@tra_ID INT,
	@tra_Descripcion NVARCHAR(80),
	@usu_UsuarioModificacion INT,
	@tra_FechaModificacion DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		-- Validar existencia
		IF NOT EXISTS (SELECT 1 FROM Odon.tbTratamientos WHERE tra_ID = @tra_ID AND tra_Estado = 1)
		BEGIN
			SELECT 'No se encontró el registro activo con el ID especificado.' AS MessageStatus;
			RETURN;
		END
		UPDATE Odon.tbTratamientos
		SET tra_Descripcion = @tra_Descripcion,
			usu_UsuarioModificacion = @usu_UsuarioModificacion,
			tra_FechaModificacion = @tra_FechaModificacion
		WHERE tra_ID = @tra_ID;

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
CREATE OR ALTER PROCEDURE Odon.sp_EliminarTipoTratamiento
	@tra_ID INT,
	@usu_UsuarioEliminacion INT,
	@tra_FechaEliminacion DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		-- Validar existencia activa
		IF NOT EXISTS (SELECT 1 FROM Odon.tbTratamientos WHERE tra_ID = @tra_ID AND tra_Estado = 1)
		BEGIN
			SELECT 'El registro no existe o ya fue eliminado.' AS MessageStatus;
			RETURN;
		END

		UPDATE Odon.tbTratamientos
		SET tra_Estado = 0,
			usu_UsuarioEliminacion = @usu_UsuarioEliminacion,
			tra_FechaEliminacion = @tra_FechaEliminacion
		WHERE tra_ID = @tra_ID;

		SELECT 'Registro eliminado exitosamente.' AS MessageStatus;
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMsg NVARCHAR(4000) = ERROR_MESSAGE();
		SELECT CONCAT('Error al eliminar el registro: ', @ErrorMsg) AS MessageStatus;
		RETURN;
	END CATCH
END;
GO