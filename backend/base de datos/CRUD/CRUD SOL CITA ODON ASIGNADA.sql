---------------------------------------------------  SOL CITA ODON ASIGNADA  -----------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
---LISTAR
CREATE OR ALTER PROCEDURE Odon.sp_ListarSolOdonAsignada
AS
BEGIN
	SET NOCOUNT ON;

	SELECT 
		-- Datos principales del tipo de consulta
		odon.sca_ID,
		odon.sco_ID,
		odon.per_ID,
		odon.sca_Cancel,
		per.per_Nombres + per.per_Apellidos AS 'Nombre_Emp',
		solci.est_ID,
		estu.est_NombreCompleto,

		-- ======== DATOS DEL USUARIO CREADOR ========
		usuC.usu_ID AS usu_UsuarioCreacion,
		usuC.usu_Usuario AS Usuario_C,
		perC.per_ID AS ID_Creador,
		(perC.per_Nombres + ' ' + perC.per_Apellidos) AS NombreCompleto_C,
		odon.sca_FechaCreacion,

		-- ======== DATOS DEL USUARIO MODIFICADOR ========
		usuM.usu_ID AS usu_UsuarioModificacion,
		usuM.usu_Usuario AS Usuario_M,
		perM.per_ID AS ID_Modificador,
		(perM.per_Nombres + ' ' + perM.per_Apellidos) AS NombreCompleto_M,
		odon.sca_FechaModificacion,

		-- ======== DATOS DEL USUARIO ELIMINADOR ========
		usuE.usu_ID AS usu_UsuarioEliminacion,
		usuE.usu_Usuario AS Usuario_E,
		perE.per_ID AS ID_Eliminador,
		(perE.per_Nombres + ' ' + perE.per_Apellidos) AS NombreCompleto_E,
		odon.sca_FechaEliminacion

	FROM Odon.tbSolicitudOdonAsignada odon
		INNER JOIN Gral.tbPersonal per  ON odon.per_ID = per.per_ID
		INNER JOIN Odon.tbSolicitudCitaOdon solci ON odon.sco_ID = solci.sco_ID
		INNER JOIN Gral.tbEstudiantes estu ON solci.est_ID = estu.est_ID
		-- JOIN con Usuario Creador
		INNER JOIN Acce.tbUsuarios usuC ON Odon.usu_UsuarioCreacion = usuC.usu_ID
		INNER JOIN Gral.tbPersonal perC ON usuC.per_ID = perC.per_ID

		-- JOIN con Usuario Modificador
		LEFT JOIN Acce.tbUsuarios usuM ON Odon.usu_UsuarioModificacion = usuM.usu_ID
		LEFT JOIN Gral.tbPersonal perM ON usuM.per_ID = perM.per_ID

		-- JOIN con Usuario Eliminador
		LEFT JOIN Acce.tbUsuarios usuE ON Odon.usu_UsuarioEliminacion = usuE.usu_ID
		LEFT JOIN Gral.tbPersonal perE ON usuE.per_ID = perE.per_ID

	WHERE Odon.sca_Estado = 1;
END;
GO


---CREAR
CREATE OR ALTER PROCEDURE Odon.sp_CrearSolOdonAsignada
	@sco_ID			INT, 
	@per_ID			INT, 
	@sca_Cancel		BIT, 
	@usu_UsuarioCreacion	INT, 
	@sca_FechaCreacion		DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		
		INSERT INTO Odon.tbSolicitudOdonAsignada
		(sco_ID, per_ID, sca_Cancel,usu_UsuarioCreacion,sca_FechaCreacion)
		VALUES
		(@sco_ID, @per_ID, @sca_Cancel, @usu_UsuarioCreacion,@sca_FechaCreacion);

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
CREATE OR ALTER PROCEDURE Odon.sp_EditarSolOdonAsignada
	@sca_ID			INT,
	@sco_ID			INT, 
	@per_ID			INT, 
	@sca_Cancel		BIT, 
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
CREATE OR ALTER PROCEDURE Odon.sp_EliminarSolOdonAsignada
	@sca_ID INT,
	@usu_UsuarioEliminacion INT,
	@sca_FechaEliminacion DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY

		UPDATE Odon.tbSolicitudOdonAsignada
		SET sca_Estado = 0,
			usu_UsuarioEliminacion = @usu_UsuarioEliminacion,
			sca_FechaEliminacion = @sca_FechaEliminacion
		WHERE sca_ID = @sca_ID;

		SELECT 'Registro eliminado exitosamente.' AS MessageStatus;
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMsg NVARCHAR(4000) = ERROR_MESSAGE();
		SELECT CONCAT('Error al eliminar el registro: ', @ErrorMsg) AS MessageStatus;
		RETURN;
	END CATCH
END;
GO