---------------------------------------------------  AREAS  -----------------------------------------------------
----------------------------------------------------------------------------------------------------------------

---LISTAR
CREATE OR ALTER PROCEDURE Gral.sp_ListarAreas
AS
	BEGIN
	SELECT  are_ID, 
			are_Nombre, 
			usu_UsuarioCreacion, 
			are_FechaCreacion, 
			usu_UsuarioModificacion, 
			are_FechaModificacion, 
			usu_UsuarioEliminacion, 
			are_FechaEliminacion, 
			are_Estado
	FROM [Gral].[tbAreas]  are 
	WHERE   are_Estado = 1
	END
GO

---CREAR
CREATE OR ALTER PROCEDURE Gral.sp_CrearArea
	@are_Nombre VARCHAR(25),
	@usu_UsuarioCreacion INT,
	@are_FechaCreacion DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		-- Validar que no exista duplicado por nombre, apellido y correo
		IF EXISTS (SELECT 1 FROM Gral.tbAreas 
				   WHERE are_Nombre = @are_Nombre
				   AND are_Estado = 1)
		BEGIN
			SELECT 'El registro ya existe.' AS MessageStatus;
			RETURN;
		END
		INSERT INTO Gral.tbAreas
		(are_Nombre,usu_UsuarioCreacion,are_FechaCreacion)
		VALUES
		(@are_Nombre,@usu_UsuarioCreacion,@are_FechaCreacion);

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
CREATE OR ALTER PROCEDURE Gral.sp_EditarArea
	@are_ID INT,
	@are_Nombre VARCHAR(25),
	@usu_UsuarioModificacion INT,
	@are_FechaModificacion DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		-- Validar existencia
		IF NOT EXISTS (SELECT 1 FROM Gral.tbAreas WHERE are_ID = @are_ID AND are_Estado = 1)
		BEGIN
			SELECT 'No se encontró el registro activo con el ID especificado.' AS MessageStatus;
			RETURN;
		END
		UPDATE Gral.tbAreas
		SET are_Nombre = @are_Nombre,
			usu_UsuarioModificacion = @usu_UsuarioModificacion,
			are_FechaModificacion = @are_FechaModificacion
		WHERE are_ID = @are_ID;

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