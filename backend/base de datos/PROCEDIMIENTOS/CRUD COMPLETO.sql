---------------------------------------------------  AREAS  -----------------------------------------------------
----------------------------------------------------------------------------------------------------------------

---LISTAR
CREATE OR ALTER PROCEDURE Gral.sp_ListarAreas
AS
BEGIN
	SET NOCOUNT ON;

	SELECT 
		-- Datos principales del área
		are.are_ID,
		are.are_Nombre,
		are.are_Estado,

		-- ======== DATOS DEL USUARIO CREADOR ========
		usuC.usu_ID AS usu_UsuarioCreacion,
		usuC.usu_Usuario AS Usuario_C,
		perC.per_ID AS ID_Creador,
		(perC.per_Nombres + ' ' + perC.per_Apellidos) AS NombreCompleto_C,
		are.are_FechaCreacion,

		-- ======== DATOS DEL USUARIO MODIFICADOR ========
		usuM.usu_ID AS usu_UsuarioModificacion,
		usuM.usu_Usuario AS Usuario_M,
		perM.per_ID AS ID_Modificador,
		(perM.per_Nombres + ' ' + perM.per_Apellidos) AS NombreCompleto_M,
		are.are_FechaModificacion,

		-- ======== DATOS DEL USUARIO ELIMINADOR ========
		usuE.usu_ID AS usu_UsuarioEliminacion,
		usuE.usu_Usuario AS Usuario_E,
		perE.per_ID AS ID_Eliminador,
		(perE.per_Nombres + ' ' + perE.per_Apellidos) AS NombreCompleto_E,
		are.are_FechaEliminacion

	FROM Gral.tbAreas are
		-- JOIN con Usuario Creador
		INNER JOIN Acce.tbUsuarios usuC ON are.usu_UsuarioCreacion = usuC.usu_ID
		INNER JOIN Gral.tbPersonal perC ON usuC.per_ID = perC.per_ID

		-- JOIN con Usuario Modificador
		LEFT JOIN Acce.tbUsuarios usuM ON are.usu_UsuarioModificacion = usuM.usu_ID
		LEFT JOIN Gral.tbPersonal perM ON usuM.per_ID = perM.per_ID

		-- JOIN con Usuario Eliminador
		LEFT JOIN Acce.tbUsuarios usuE ON are.usu_UsuarioEliminacion = usuE.usu_ID
		LEFT JOIN Gral.tbPersonal perE ON usuE.per_ID = perE.per_ID

	WHERE are.are_Estado = 1;
END;
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
		IF EXISTS (SELECT 1 FROM Gral.tbAreas WHERE are_Nombre = @are_Nombre AND are_Estado = 1 AND are_ID != @are_ID)
		BEGIN
			SELECT 'El registro ya existe.' AS MessageStatus;
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
	@est_ID		INT,
	@tic_ID		INT,
	@coa_Descripcion NVARCHAR(MAX),
	@coa_Recomendacion NVARCHAR(MAX),
	@coa_Seguimiento BIT,
	@usu_UsuarioCreacion INT,
	@coa_FechaCreacion DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		
		INSERT INTO Acad.tbConsultasAcademicas
		(est_ID, tic_ID, coa_Descripcion, coa_Recomendacion, coa_Seguimiento, usu_UsuarioCreacion,coa_FechaCreacion)
		VALUES
		(@est_ID, @tic_ID, @coa_Descripcion, @coa_Recomendacion, @coa_Seguimiento, @usu_UsuarioCreacion,@coa_FechaCreacion);

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
	@est_ID		INT,
	@tic_ID		INT,
	@coa_Descripcion NVARCHAR(MAX),
	@coa_Recomendacion NVARCHAR(MAX),
	@coa_Seguimiento BIT,
	@usu_UsuarioModificacion INT,
	@coa_FechaModificacion DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		
		UPDATE Acad.tbConsultasAcademicas
		SET est_ID = @est_ID,
			tic_ID = @tic_ID,
			coa_Descripcion = @coa_Descripcion,
			coa_Recomendacion = @coa_Recomendacion,
			coa_Seguimiento = @coa_Seguimiento,
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
---------------------------------------------------  PERSONAL  -----------------------------------------------------
----------------------------------------------------------------------------------------------------------------
---- LISTAR TODO EL PERSONAL
CREATE OR ALTER PROCEDURE Gral.sp_ListarPersonal
AS
	BEGIN
		SELECT	
		per.per_ID, 
		per.per_Nombres, 
		per.per_Apellidos, 
		CASE 
			WHEN per.per_EstadoCivil = 'SL' THEN 'Soltero'
			WHEN per.per_EstadoCivil = 'CS' THEN 'Casado'
			WHEN per.per_EstadoCivil = 'DV' THEN 'Divorciado'
			WHEN per.per_EstadoCivil = 'VD' THEN 'Viudo'
			WHEN per.per_EstadoCivil = 'SP' THEN 'Separado'
			WHEN per.per_EstadoCivil = 'UL' THEN 'Unión Libre'
		ELSE 'N/A' 
		END AS EstadoCivil,
		per.per_EstadoCivil, 
		CASE
			WHEN per.per_Sexo = 'F' THEN 'Femenino'
			WHEN per.per_Sexo = 'M' THEN 'Masculino'
			ELSE 'N/A'
		END AS Sexo,
		per.per_Sexo, 
		per.per_FechaNac, 
		per.per_Telefono, 
		per.per_Direccion, 
		per.per_Correo, 
		are.are_ID,
		are.are_Nombre, 
		-- Datos del usuario creador
		per.usu_UsuarioCreacion,
		usuC.usu_ID AS ID_Creador,
		usuC.usu_Usuario AS Usuario_C,
		perC.per_Nombres + ' ' + perC.per_Apellidos AS NombreCompleto_C,
		per.per_FechaCreacion,
		-- Datos del usuario modificador
		per.usu_UsuarioModificacion,
		usuM.usu_ID AS ID_Modificador,
		usuM.usu_Usuario AS Usuario_M,
		perM.per_Nombres + ' ' + perM.per_Apellidos AS NombreCompleto_M,
		per.per_FechaModificacion,
		-- Datos del usuario eliminador
		per.usu_UsuarioEliminacion,
		usuE.usu_ID AS ID_Eliminador,
		usuE.usu_Usuario AS Usuario_E,
		perE.per_Nombres + ' ' + perE.per_Apellidos AS NombreCompleto_E,
		per.per_FechaEliminacion,
		per.per_Estado
	FROM Gral.tbPersonal per 
		INNER JOIN Gral.tbAreas are 
			ON per.are_ID = are.are_ID
		-- Usuario que creó el registro
		INNER JOIN Acce.tbUsuarios usuC 
			ON per.usu_UsuarioCreacion = usuC.usu_ID
		LEFT JOIN Gral.tbPersonal perC 
			ON usuC.per_ID = perC.per_ID
		-- Usuario que modificó el registro
		LEFT JOIN Acce.tbUsuarios usuM 
			ON per.usu_UsuarioModificacion = usuM.usu_ID
		LEFT JOIN Gral.tbPersonal perM 
			ON usuM.per_ID = perM.per_ID
		-- Usuario que eliminó el registro
		LEFT JOIN Acce.tbUsuarios usuE 
			ON per.usu_UsuarioEliminacion = usuE.usu_ID
		LEFT JOIN Gral.tbPersonal perE 
			ON usuE.per_ID = perE.per_ID
		WHERE per.per_Estado = 1;
	END
GO
---- CREAR PERSONAL
CREATE OR ALTER PROCEDURE Gral.sp_CrearPersonal
	@per_Nombres NVARCHAR(255),
	@per_Apellidos NVARCHAR(255),
	@per_EstadoCivil CHAR(2),
	@per_Sexo CHAR(1),
	@per_FechaNac DATE,
	@per_Telefono VARCHAR(15),
	@per_Direccion NVARCHAR(200),
	@per_Correo NVARCHAR(80),
	@are_ID INT,
	@usu_UsuarioCreacion INT
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		-- Validar que no exista duplicado por nombre, apellido y correo
		IF EXISTS (SELECT 1 FROM Gral.tbPersonal 
				   WHERE per_Nombres = @per_Nombres 
				   AND per_Apellidos = @per_Apellidos
				   AND per_Correo = @per_Correo
				   AND per_Estado = 1)
		BEGIN
			SELECT 'El registro ya existe con el mismo nombre, apellido y correo.' AS MessageStatus;
			RETURN;
		END

		INSERT INTO Gral.tbPersonal
		(per_Nombres, per_Apellidos, per_EstadoCivil, per_Sexo, per_FechaNac, per_Telefono, 
		 per_Direccion, per_Correo, are_ID, usu_UsuarioCreacion, per_FechaCreacion, per_Estado)
		VALUES
		(@per_Nombres, @per_Apellidos, @per_EstadoCivil, @per_Sexo, @per_FechaNac, @per_Telefono, 
		 @per_Direccion, @per_Correo, @are_ID, @usu_UsuarioCreacion, GETDATE(), 1);

		SELECT 'Registro creado correctamente.' AS MessageStatus;
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMsg NVARCHAR(4000) = ERROR_MESSAGE();
		SELECT CONCAT('Error al crear el registro: ', @ErrorMsg) AS MessageStatus;
		RETURN;
	END CATCH
END;
GO
---- EDITAR PERSONAL
CREATE OR ALTER PROCEDURE Gral.sp_EditarPersonal
	@per_ID INT,
	@per_Nombres NVARCHAR(255),
	@per_Apellidos NVARCHAR(255),
	@per_EstadoCivil CHAR(2),
	@per_Sexo CHAR(1),
	@per_FechaNac DATE,
	@per_Telefono VARCHAR(15),
	@per_Direccion NVARCHAR(200),
	@per_Correo NVARCHAR(80),
	@are_ID INT,
	@usu_UsuarioModificacion INT
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		-- Validar existencia
		IF NOT EXISTS (SELECT 1 FROM Gral.tbPersonal WHERE per_ID = @per_ID AND per_Estado = 1)
		BEGIN
			SELECT 'No se encontró el registro activo con el ID especificado.' AS MessageStatus;
			RETURN;
		END
		UPDATE Gral.tbPersonal
		SET per_Nombres = @per_Nombres,
			per_Apellidos = @per_Apellidos,
			per_EstadoCivil = @per_EstadoCivil,
			per_Sexo = @per_Sexo,
			per_FechaNac = @per_FechaNac,
			per_Telefono = @per_Telefono,
			per_Direccion = @per_Direccion,
			per_Correo = @per_Correo,
			are_ID = @are_ID,
			usu_UsuarioModificacion = @usu_UsuarioModificacion,
			per_FechaModificacion = GETDATE()
		WHERE per_ID = @per_ID;

		SELECT 'Registro actualizado correctamente.' AS MessageStatus;
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMsg NVARCHAR(4000) = ERROR_MESSAGE();
		SELECT CONCAT('Error al editar el registro: ', @ErrorMsg) AS MessageStatus;
	RETURN;
	END CATCH
END;
GO
---- ELIMINAR PERSONAL
CREATE OR ALTER PROCEDURE Gral.sp_EliminarPersonal
	@per_ID INT,
	@usu_UsuarioEliminacion INT
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		-- Validar existencia activa
		IF NOT EXISTS (SELECT 1 FROM Gral.tbPersonal WHERE per_ID = @per_ID AND per_Estado = 1)
		BEGIN
			SELECT 'El registro no existe o ya fue eliminado.' AS MessageStatus;
			RETURN;
		END

		UPDATE Gral.tbPersonal
		SET per_Estado = 0,
			usu_UsuarioEliminacion = @usu_UsuarioEliminacion,
			per_FechaEliminacion = GETDATE()
		WHERE per_ID = @per_ID;

		SELECT 'Registro eliminado exitosamente.' AS MessageStatus;
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMsg NVARCHAR(4000) = ERROR_MESSAGE();
		SELECT CONCAT('Error al eliminar el registro: ', @ErrorMsg) AS MessageStatus;
		RETURN;
	END CATCH
END;
GO
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
---------------------------------------------------  SOLICITUD DE APOYO  -----------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
---LISTAR
CREATE OR ALTER PROCEDURE Psi.sp_ListarSolicitudApoyo
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        sol.sol_ID,
        sol.est_ID,
        est.est_NombreCompleto,
        sol.sol_ResumenSesion,
        sol.sol_MotivoConsulta,
        sol.sol_MalestarEmocional,
        sol.sol_Asistencia,
        sol.sol_HorarioPref,
        sol.sol_Estado,
        sol.sol_FechaCreacion,
        sol.sol_FechaModificacion,
        sol.sol_FechaEliminacion

    FROM Psi.tbSolicitudApoyo sol
        INNER JOIN Gral.tbEstudiantes est ON sol.est_ID = est.est_ID
    WHERE 
        sol.sol_Estado = 1;
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
	@sol_FechaCreacion DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		
		INSERT INTO Psi.tbSolicitudApoyo
		(est_ID, sol_ResumenSesion, sol_MotivoConsulta, sol_MalestarEmocional, sol_Asistencia, sol_HorarioPref, sol_FechaCreacion)
		VALUES
		(@est_ID, @sol_ResumenSesion, @sol_MotivoConsulta, @sol_MalestarEmocional, @sol_Asistencia, @sol_HorarioPref, @sol_FechaCreacion);

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
CREATE OR ALTER PROCEDURE Acad.sp_EliminarTipoConsulta
	@tic_ID INT,
	@usu_UsuarioEliminacion INT,
	@tic_FechaEliminacion DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		-- Validar existencia activa
		IF NOT EXISTS (SELECT 1 FROM Acad.tbTipoConsulta WHERE tic_ID = @tic_ID AND tic_Estado = 1)
		BEGIN
			SELECT 'El registro no existe o ya fue eliminado.' AS MessageStatus;
			RETURN;
		END

		UPDATE Acad.tbTipoConsulta
		SET tic_Estado = 0,
			usu_UsuarioEliminacion = @usu_UsuarioEliminacion,
			tic_FechaEliminacion = @tic_FechaEliminacion
		WHERE tic_ID = @tic_ID;

		SELECT 'Registro eliminado exitosamente.' AS MessageStatus;
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMsg NVARCHAR(4000) = ERROR_MESSAGE();
		SELECT CONCAT('Error al eliminar el registro: ', @ErrorMsg) AS MessageStatus;
		RETURN;
	END CATCH
END;
GO
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
---------------------------------------------------  USUARIOS  -----------------------------------------------------
----------------------------------------------------------------------------------------------------------------

---LISTAR
CREATE OR ALTER PROCEDURE Acce.sp_ListarUsuarios
AS
BEGIN
	SET NOCOUNT ON;

	SELECT 
		-- Datos principales del usuario
		usua.usu_ID, 
		usua.usu_Usuario, 
		usua.per_ID, 
		staff.per_Nombres + ' ' + staff.per_Apellidos AS per_Nombres,
		usua.rol_ID, 
		rol.rol_Descripcion,
		usua.usu_Estado,

		-- ======== DATOS DEL USUARIO CREADOR ========
		usuC.usu_ID AS usu_UsuarioCreacion,
		usuC.usu_Usuario AS Usuario_C,
		perC.per_ID AS ID_Creador,
		(perC.per_Nombres + ' ' + perC.per_Apellidos) AS NombreCompleto_C,
		usua.usu_FechaCreacion,

		-- ======== DATOS DEL USUARIO MODIFICADOR ========
		usuM.usu_ID AS usu_UsuarioModificacion,
		usuM.usu_Usuario AS Usuario_M,
		perM.per_ID AS ID_Modificador,
		(perM.per_Nombres + ' ' + perM.per_Apellidos) AS NombreCompleto_M,
		usua.usu_FechaModificacion,

		-- ======== DATOS DEL USUARIO ELIMINADOR ========
		usuE.usu_ID AS usu_UsuarioEliminacion,
		usuE.usu_Usuario AS Usuario_E,
		perE.per_ID AS ID_Eliminador,
		(perE.per_Nombres + ' ' + perE.per_Apellidos) AS NombreCompleto_E,
		usua.usu_FechaEliminacion

	FROM Acce.tbUsuarios usua
		INNER JOIN Gral.tbPersonal staff ON usua.per_ID = staff.per_ID
		INNER JOIN Acce.tbRoles	rol		 ON	usua.rol_ID = rol.rol_ID
		-- JOIN con Usuario Creador
		INNER JOIN Acce.tbUsuarios usuC ON usua.usu_UsuarioCreacion = usuC.usu_ID
		INNER JOIN Gral.tbPersonal perC ON usuC.per_ID = perC.per_ID

		-- JOIN con Usuario Modificador
		LEFT JOIN Acce.tbUsuarios usuM ON usua.usu_UsuarioModificacion = usuM.usu_ID
		LEFT JOIN Gral.tbPersonal perM ON usuM.per_ID = perM.per_ID

		-- JOIN con Usuario Eliminador
		LEFT JOIN Acce.tbUsuarios usuE ON usua.usu_UsuarioEliminacion = usuE.usu_ID
		LEFT JOIN Gral.tbPersonal perE ON usuE.per_ID = perE.per_ID

	WHERE usua.usu_Estado = 1;
END;
GO

---CREAR
CREATE OR ALTER PROCEDURE Acce.sp_CrearUsuario
	@usu_Usuario NVARCHAR(80),
	@usu_Contrasena VARCHAR(255),
	@per_ID	INT,
	@rol_ID	INT,
	@usu_UsuarioCreacion INT,
	@usu_FechaCreacion DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		-- Validar que no exista duplicado por nombre, apellido y correo
		IF EXISTS (SELECT 1 FROM Acce.tbUsuarios 
				   WHERE usu_Usuario = @usu_Usuario
				   AND usu_Estado = 1)
		BEGIN
			SELECT 'Ya existe un usuario con ese correo.' AS MessageStatus;
			RETURN;
		END

		DECLARE @Pass AS VARCHAR(255), @Clave AS VARCHAR(255);
		SET @Clave = @usu_Contrasena;
		SET @Pass = CONVERT(VARCHAR(255), HASHBYTES('SHA2_256', @Clave), 2)

		INSERT INTO Acce.tbUsuarios
		(usu_Usuario, usu_Contrasena, per_ID, rol_ID, usu_UsuarioCreacion, usu_FechaCreacion)
		VALUES
		(@usu_Usuario, @Pass,			@per_ID, @rol_ID, @usu_UsuarioCreacion,@usu_FechaCreacion);

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
CREATE OR ALTER PROCEDURE Acce.sp_EditarUsuario
	@usu_ID		INT,
	@usu_Usuario NVARCHAR(80),
	@per_ID	INT,
	@rol_ID	INT,
	@usu_UsuarioModificacion INT,
	@usu_FechaModificacion DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		
		UPDATE Acce.tbUsuarios
			SET usu_Usuario = @usu_Usuario,
				per_ID = @per_ID,
				rol_ID =  @rol_ID,
				usu_UsuarioModificacion = @usu_UsuarioModificacion,
				usu_FechaModificacion = @usu_FechaModificacion
		WHERE usu_ID = @usu_ID;

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
CREATE OR ALTER PROCEDURE Acce.sp_DesactivarUsuario
	@usu_ID INT,
	@usu_UsuarioEliminacion INT,
	@usu_FechaEliminacion DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		
		UPDATE Acce.tbUsuarios
		SET usu_Estado = 0,
			usu_UsuarioEliminacion = @usu_UsuarioEliminacion,
			usu_FechaEliminacion = @usu_FechaEliminacion
		WHERE usu_ID = @usu_ID;

		SELECT 'Registro desactivado exitosamente.' AS MessageStatus;
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMsg NVARCHAR(4000) = ERROR_MESSAGE();
		SELECT CONCAT('Error al desactivar el registro: ', @ErrorMsg) AS MessageStatus;
		RETURN;
	END CATCH
END;
GO

-- CAMBIAR CONTRASEÑA
CREATE OR ALTER PROCEDURE Acce.sp_CambiarContrasenia
	@usu_ID INT,
	@usu_Contrasena VARCHAR(255),
	@usu_UsuarioModificacion INT,
	@usu_FechaModificacion DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY

		DECLARE @Pass AS VARCHAR(255), @Clave AS VARCHAR(255);
		SET @Clave = @usu_Contrasena;
		SET @Pass = CONVERT(VARCHAR(255), HASHBYTES('SHA2_256', @Clave), 2)

		UPDATE Acce.tbUsuarios
		SET usu_Contrasena = @Pass,
			usu_UsuarioModificacion = @usu_UsuarioModificacion,
			usu_FechaModificacion = @usu_FechaModificacion
		WHERE usu_ID = @usu_ID;

		SELECT 'La contraseña se actualizó exitosamente.' AS MessageStatus;
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMsg NVARCHAR(4000) = ERROR_MESSAGE();
		SELECT CONCAT('Error al actualizar el registro: ', @ErrorMsg) AS MessageStatus;
		RETURN;
	END CATCH
END;
GO