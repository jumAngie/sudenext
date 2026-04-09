--USE SUDENEXT
--GO
---------------------------------------------------  ESTUDIANTES  -----------------------------------------------------
----------------------------------------------------------------------------------------------------------------
---LOGIN ESTUDIANTES
GO
CREATE OR ALTER PROCEDURE Gral.sp_EstudiantesLogin
	@est_NumeroCuenta     VARCHAR(11),
	@est_Contra           VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    -- Convertir contraseña ingresada a HASH
    DECLARE @HashContra VARCHAR(255);
    SET @HashContra = CONVERT(VARCHAR(255), HASHBYTES('SHA2_256', @est_Contra), 2);

    -- Validar que exista el estudiante
    IF NOT EXISTS (SELECT 1 FROM Gral.tbEstudiantes WHERE est_NumeroCuenta = @est_NumeroCuenta)
    BEGIN
        SELECT 
            0 AS codeStatus,
            'El número de cuenta no existe.' AS messageStatus;
        RETURN;
    END;

    -- Validar contraseña hasheada
    IF NOT EXISTS (
        SELECT 1 
        FROM Gral.tbEstudiantes 
        WHERE est_NumeroCuenta = @est_NumeroCuenta
          AND est_Contra = @HashContra
    )
    BEGIN
        SELECT 
            0 AS codeStatus,
            'La contraseña es incorrecta.' AS messageStatus;
        RETURN;
    END;

    -- Validar si el estudiante está matriculado
    IF EXISTS (
        SELECT 1
        FROM Gral.tbEstudiantes
        WHERE est_NumeroCuenta = @est_NumeroCuenta
          AND est_Contra = @HashContra
          AND est_EstadoM = 0
    )
    BEGIN
        SELECT 
            0 AS codeStatus,
            'El estudiante no está matriculado en el período actual.' AS messageStatus;
        RETURN;
    END;

    -- Login correcto devolver datos
    SELECT 
        1 AS codeStatus,
        'Inicio de sesión exitoso.' AS messageStatus,
        est_ID,
        est_NumeroCuenta,
        est_NombreCompleto,
        est_Correo,
        est_Celular,
        est_Carrera,
        est_EstadoM
    FROM Gral.tbEstudiantes
    WHERE est_NumeroCuenta = @est_NumeroCuenta
      AND est_Contra = @HashContra;
END;
GO
---------------------------------------------------  USUARIOS  -----------------------------------------------------
--------------------------------------------------------------------------------------------------------------------
CREATE OR ALTER PROCEDURE Acce.sp_UsuariosLogin
	@usu_Usuario     NVARCHAR(80),
	@usu_Contrasena  VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    -- Convertir contraseña ingresada a HASH
    DECLARE @HashContra VARCHAR(255);
    SET @HashContra = CONVERT(VARCHAR(255), HASHBYTES('SHA2_256', @usu_Contrasena), 2);

    -- Validar que exista el estudiante
    IF NOT EXISTS (SELECT 1 FROM Acce.tbUsuarios WHERE usu_Usuario = @usu_Usuario)
    BEGIN
        SELECT 
            0 AS codeStatus,
            'La cuenta no existe.' AS messageStatus;
        RETURN;
    END;

    -- Validar contraseña hasheada
    IF NOT EXISTS (
        SELECT 1 
        FROM Acce.tbUsuarios 
        WHERE usu_Usuario = @usu_Usuario
          AND usu_Contrasena = @HashContra
    )
    BEGIN
        SELECT 
            0 AS codeStatus,
            'La contraseña es incorrecta.' AS messageStatus;
        RETURN;
    END;

    -- Login correcto devolver datos
    SELECT 
        1 AS codeStatus,
        'Inicio de sesión exitoso.' AS messageStatus,
        usu.usu_ID, 
		usu.usu_Usuario, 
		usu.per_ID, 
		usu.rol_ID,
		rol.rol_Descripcion,

		per_Nombres, 
		per_Apellidos,
		CASE 
			WHEN per.per_EstadoCivil = 'SL' THEN 'Soltero'
			WHEN per.per_EstadoCivil = 'CS' THEN 'Casado'
			WHEN per.per_EstadoCivil = 'DV' THEN 'Divorciado'
			WHEN per.per_EstadoCivil = 'VD' THEN 'Viudo'
			WHEN per.per_EstadoCivil = 'SP' THEN 'Separado'
			WHEN per.per_EstadoCivil = 'UL' THEN 'Unión Libre'
		ELSE 'N/A'
		END AS per_EstadoCivil,
		CASE
			WHEN per.per_Sexo = 'F' THEN 'Femenino'
			WHEN per.per_Sexo = 'M' THEN 'Masculino'
			ELSE 'N/A'
		END AS per_Sexo, 
		per_FechaNac, 
		per_Telefono, 
		per_Direccion, 
		per_Correo, 
		per.are_ID,

		are.are_Nombre
		
    FROM Acce.tbUsuarios usu		INNER JOIN Acce.tbRoles rol
	     ON	usu.rol_ID = rol.rol_ID INNER JOIN Gral.tbPersonal per
		 ON usu.per_ID = per.per_ID	INNER JOIN Gral.tbAreas are
		 ON per.are_ID = are.are_ID
    WHERE usu_Usuario = @usu_Usuario
      AND usu_Contrasena = @HashContra;
END;
GO
