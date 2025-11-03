---------------------------------------------------  GRAL  -----------------------------------------------------
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
		usuC.usu_ID AS ID_Creador,
		usuC.usu_Usuario AS Usuario_C,
		perC.per_Nombres + ' ' + perC.per_Apellidos AS NombreCompleto_C,
		per.per_FechaCreacion,
		-- Datos del usuario modificador
		usuM.usu_ID AS ID_Modificador,
		usuM.usu_Usuario AS Usuario_M,
		perM.per_Nombres + ' ' + perM.per_Apellidos AS NombreCompleto_M,
		per.per_FechaModificacion,
		-- Datos del usuario eliminador
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