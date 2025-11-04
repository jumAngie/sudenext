---------------------------------------------------  CONSULTAS ACADEMICAS  -----------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
---LISTAR
CREATE OR ALTER PROCEDURE Acad.sp_ListarConsultaAcademicas
AS
BEGIN
	SET NOCOUNT ON;
	SELECT 
		-- Datos principales del tipo de consulta
		coa.coa_ID,
		coa.est_ID,
		est.est_NombreCompleto,
		coa.tic_ID,
		tic.tic_Descripcion,
		coa.coa_Descripcion,
		coa.coa_Recomendacion,
		coa.coa_Seguimiento,
		CASE
			WHEN coa.coa_Seguimiento = 0 THEN 'No necesita seguimiento.'
			WHEN coa.coa_Seguimiento = 1 THEN 'Necesita seguimiento.'
			ELSE 'N/A' 
		END AS Seguimiento,
		coa.coa_Estado,

		-- ======== DATOS DEL USUARIO CREADOR ========
		usuC.usu_ID AS usu_UsuarioCreacion,
		usuC.usu_Usuario AS Usuario_C,
		perC.per_ID AS ID_Creador,
		(perC.per_Nombres + ' ' + perC.per_Apellidos) AS NombreCompleto_C,
		coa.coa_FechaCreacion,

		-- ======== DATOS DEL USUARIO MODIFICADOR ========
		usuM.usu_ID AS usu_UsuarioModificacion,
		usuM.usu_Usuario AS Usuario_M,
		perM.per_ID AS ID_Modificador,
		(perM.per_Nombres + ' ' + perM.per_Apellidos) AS NombreCompleto_M,
		coa.coa_FechaModificacion,

		-- ======== DATOS DEL USUARIO ELIMINADOR ========
		usuE.usu_ID AS usu_UsuarioEliminacion,
		usuE.usu_Usuario AS Usuario_E,
		perE.per_ID AS ID_Eliminador,
		(perE.per_Nombres + ' ' + perE.per_Apellidos) AS NombreCompleto_E,
		coa.coa_FechaEliminacion

	FROM Acad.tbConsultasAcademicas coa
		INNER JOIN Gral.tbEstudiantes est ON coa.est_ID = est.est_ID
		INNER JOIN Acad.tbTipoConsulta tic ON coa.tic_ID = tic.tic_ID
		-- JOIN con Usuario Creador
		INNER JOIN Acce.tbUsuarios usuC ON coa.usu_UsuarioCreacion = usuC.usu_ID
		INNER JOIN Gral.tbPersonal perC ON usuC.per_ID = perC.per_ID

		-- JOIN con Usuario Modificador
		LEFT JOIN Acce.tbUsuarios usuM ON coa.usu_UsuarioModificacion = usuM.usu_ID
		LEFT JOIN Gral.tbPersonal perM ON usuM.per_ID = perM.per_ID

		-- JOIN con Usuario Eliminador
		LEFT JOIN Acce.tbUsuarios usuE ON coa.usu_UsuarioEliminacion = usuE.usu_ID
		LEFT JOIN Gral.tbPersonal perE ON usuE.per_ID = perE.per_ID

	WHERE coa.coa_Estado = 1;
END;
GO


---CREAR
CREATE OR ALTER PROCEDURE Acad.sp_CrearConsultaAcademicas
	@coa_Descripcion NVARCHAR(80),
	@usu_UsuarioCreacion INT,
	@coa_FechaCreacion DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		-- Validar que no exista duplicado 
		IF EXISTS (SELECT 1 FROM Acad.tbConsultasAcademicas
				   WHERE coa_Descripcion = @coa_Descripcion
				   AND coa_Estado = 1)
		BEGIN
			SELECT 'El registro ya existe.' AS MessageStatus;
			RETURN;
		END
		INSERT INTO Acad.tbConsultasAcademicas
		(coa_Descripcion,usu_UsuarioCreacion,coa_FechaCreacion)
		VALUES
		(@coa_Descripcion,@usu_UsuarioCreacion,@coa_FechaCreacion);

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
CREATE OR ALTER PROCEDURE Acad.sp_EditarConsultaAcademicas
	@coa_ID INT,
	@coa_Descripcion NVARCHAR(80),
	@usu_UsuarioModificacion INT,
	@coa_FechaModificacion DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		-- Validar existencia
		IF NOT EXISTS (SELECT 1 FROM Acad.tbConsultasAcademicas WHERE coa_ID = @coa_ID AND coa_Estado = 1)
		BEGIN
			SELECT 'No se encontró el registro activo con el ID especificado.' AS MessageStatus;
			RETURN;
		END
		UPDATE Acad.tbConsultasAcademicas
		SET coa_Descripcion = @coa_Descripcion,
			usu_UsuarioModificacion = @usu_UsuarioModificacion,
			coa_FechaModificacion = @coa_FechaModificacion
		WHERE coa_ID = @coa_ID;

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
CREATE OR ALTER PROCEDURE Acad.sp_EliminarConsultaAcademicas
	@coa_ID INT,
	@usu_UsuarioEliminacion INT,
	@coa_FechaEliminacion DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		-- Validar existencia activa
		IF NOT EXISTS (SELECT 1 FROM Acad.tbConsultasAcademicas WHERE coa_ID = @coa_ID AND coa_Estado = 1)
		BEGIN
			SELECT 'El registro no existe o ya fue eliminado.' AS MessageStatus;
			RETURN;
		END

		UPDATE Acad.tbConsultasAcademicas
		SET coa_Estado = 0,
			usu_UsuarioEliminacion = @usu_UsuarioEliminacion,
			coa_FechaEliminacion = @coa_FechaEliminacion
		WHERE coa_ID = @coa_ID;

		SELECT 'Registro eliminado exitosamente.' AS MessageStatus;
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMsg NVARCHAR(4000) = ERROR_MESSAGE();
		SELECT CONCAT('Error al eliminar el registro: ', @ErrorMsg) AS MessageStatus;
		RETURN;
	END CATCH
END;
GO