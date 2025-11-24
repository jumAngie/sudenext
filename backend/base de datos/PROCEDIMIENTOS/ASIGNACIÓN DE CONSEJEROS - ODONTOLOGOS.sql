---------------------------------------------------  CREAR ASIGNACIÓN DE ODONTOLOGO  -------------------------------------
----------------------------------------------------------------------------------------------------------------
---CREAR
CREATE OR ALTER PROCEDURE Odon.sp_CrearSolicitudOdonAsignada
	@sco_ID INT, 
	@per_ID	INT, 
	@sca_Cancel BIT,
	@usu_UsuarioCreacion INT,
	@sca_FechaCreacion DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		INSERT INTO Odon.tbSolicitudOdonAsignada
		(sco_ID, per_ID,  sca_Cancel, usu_UsuarioCreacion, sca_FechaCreacion)
		VALUES
		(@sco_ID, @per_ID, @sca_Cancel, @usu_UsuarioCreacion, @sca_FechaCreacion);

		SELECT 'Registro asignado correctamente.' AS MessageStatus;
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMsg NVARCHAR(4000) = ERROR_MESSAGE();
		SELECT CONCAT('Error al crear el registro: ', @ErrorMsg) AS MessageStatus;
		RETURN;
	END CATCH
END;
GO
----EDITAR
CREATE OR ALTER PROCEDURE Odon.sp_EditarSolicitudOdonAsignada
	@sca_ID INT,
	@sco_ID INT, 
	@per_ID	INT, 
	@sca_Cancel BIT,
	@usu_UsuarioModificacion INT,
	@sca_FechaModificacion DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		
		UPDATE Odon.tbSolicitudOdonAsignada
		SET sco_ID = @sco_ID,
			per_ID = @per_ID,
			sca_Cancel = @sca_Cancel,
			usu_UsuarioModificacion = @usu_UsuarioModificacion,
			sca_FechaModificacion = @sca_FechaModificacion
		WHERE sca_ID = @sca_ID;

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
CREATE OR ALTER PROCEDURE Odon.sp_EliminarSolicitudOdonAsignada
	@sca_ID INT,
	@usu_UsuarioEliminacion INT,
	@sca_FechaEliminacion DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY

		UPDATE Odon.tbSolicitudOdonAsignada
		SET sca_Cancel = 0,
			usu_UsuarioEliminacion = @usu_UsuarioEliminacion,
			sca_FechaEliminacion = @sca_FechaEliminacion
		WHERE sca_ID = @sca_ID;

		SELECT 'Registro cancelado exitosamente.' AS MessageStatus;
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMsg NVARCHAR(4000) = ERROR_MESSAGE();
		SELECT CONCAT('Error al eliminar el registro: ', @ErrorMsg) AS MessageStatus;
		RETURN;
	END CATCH
END;
GO
---------------------------------------------------  CREAR ASIGNACIÓN DE CONSEJERO  -------------------------------------
----------------------------------------------------------------------------------------------------------------
---CREAR
CREATE OR ALTER PROCEDURE Psi.sp_CrearSolicitudApoyoAsignada
	@sol_ID INT, 
	@per_ID	INT, 
	@spa_Cancel BIT,
	@usu_UsuarioCreacion INT,
	@spa_FechaCreacion DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		INSERT INTO Psi.tbSolicitudApoyoAsignada
		(sol_ID, per_ID,  spa_Cancel, usu_UsuarioCreacion, spa_FechaCreacion)
		VALUES
		(@sol_ID, @per_ID, @spa_Cancel, @usu_UsuarioCreacion, @spa_FechaCreacion);

		SELECT 'Registro asignado correctamente.' AS MessageStatus;
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMsg NVARCHAR(4000) = ERROR_MESSAGE();
		SELECT CONCAT('Error al crear el registro: ', @ErrorMsg) AS MessageStatus;
		RETURN;
	END CATCH
END;
GO
----EDITAR
CREATE OR ALTER PROCEDURE Psi.sp_EditarSolicitudApoyoAsignada
	@spa_ID INT,
	@sol_ID INT, 
	@per_ID	INT, 
	@spa_Cancel BIT,
	@usu_UsuarioModificacion INT,
	@spa_FechaModificacion DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		
		UPDATE Psi.tbSolicitudApoyoAsignada
		SET sol_ID = @sol_ID,
			per_ID = @per_ID,
			spa_Cancel = @spa_Cancel,
			usu_UsuarioModificacion = @usu_UsuarioModificacion,
			spa_FechaModificacion = @spa_FechaModificacion
		WHERE spa_ID = @spa_ID;

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
CREATE OR ALTER PROCEDURE Psi.sp_EliminarSolicitudApoyoAsignada
	@spa_ID INT,
	@usu_UsuarioEliminacion INT,
	@spa_FechaEliminacion DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY

		UPDATE Psi.tbSolicitudApoyoAsignada
		SET spa_Cancel = 0,
			usu_UsuarioEliminacion = @usu_UsuarioEliminacion,
			spa_FechaEliminacion = @spa_FechaEliminacion
		WHERE spa_ID = @spa_ID;

		SELECT 'Registro cancelado exitosamente.' AS MessageStatus;
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMsg NVARCHAR(4000) = ERROR_MESSAGE();
		SELECT CONCAT('Error al eliminar el registro: ', @ErrorMsg) AS MessageStatus;
		RETURN;
	END CATCH
END;
GO