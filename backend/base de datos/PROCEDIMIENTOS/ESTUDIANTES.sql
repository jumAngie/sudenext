---------------------------------------------------  ESTUDIANTES  -----------------------------------------------------
----------------------------------------------------------------------------------------------------------------
---LISTAR
CREATE OR ALTER PROCEDURE Gral.sp_EstudiantesLogin
	@est_NumeroCuenta     NVARCHAR(20),
	@est_Contra          NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    -- Validar que exista el estudiante
    IF NOT EXISTS (SELECT 1 FROM Gral.tbEstudiantes WHERE est_NumeroCuenta = @est_NumeroCuenta)
    BEGIN
        SELECT 
            0 AS codeStatus,
            'El número de cuenta no existe.' AS messageStatus;
        RETURN;
    END;

    -- Validar contraseña
    IF NOT EXISTS (
        SELECT 1 
        FROM Gral.tbEstudiantes 
        WHERE est_NumeroCuenta = @est_NumeroCuenta
        AND est_Contra = @est_Contra
    )
    BEGIN
        SELECT 
            0 AS codeStatus,
            'La contraseña es incorrecta.' AS messageStatus;
        RETURN;
    END;

	-- Validar si el estudiante está matriculado (est_EstadoM = 1)
    IF EXISTS (
        SELECT 1
        FROM Gral.tbEstudiantes
        WHERE est_NumeroCuenta = @est_NumeroCuenta
          AND est_Contra = @est_Contra
          AND est_EstadoM = 0
    )
    BEGIN
        SELECT 
            0 AS codeStatus,
            'El estudiante no está matriculado actualmente.' AS messageStatus;
        RETURN;
    END;

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
    WHERE est_NumeroCuenta = @est_NumeroCuenta;
END;
GO