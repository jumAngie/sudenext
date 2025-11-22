---------------------------------------------------  ESTUDIANTES  -----------------------------------------------------
----------------------------------------------------------------------------------------------------------------
---LISTAR
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
            'El estudiante no está matriculado actualmente.' AS messageStatus;
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