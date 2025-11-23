USE SUDENEXT
GO
---- DDL Personal Sin Usuario
CREATE OR ALTER PROCEDURE Gral.sp_DDLPersonalSinUsuario
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        per.per_ID,
        per.per_Nombres + ' ' + per.per_Apellidos AS per_Nombres,
		per.per_Correo
    FROM
        Gral.tbPersonal per LEFT JOIN Acce.tbUsuarios usu 
		ON per.per_ID = usu.per_ID
    WHERE per.per_Estado = 1 AND usu.per_ID IS NULL; 
END
GO

-- DDL del Usuarios de Consejería
CREATE OR ALTER PROCEDURE Gral.sp_DDLConsejeros
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        per.per_ID,
        per.per_Nombres + ' ' + per.per_Apellidos AS per_Nombres,
		per.per_Correo
    FROM
        Gral.tbPersonal per LEFT JOIN Acce.tbUsuarios usu 
		ON per.per_ID = usu.per_ID
    WHERE per.per_Estado = 1 AND usu.rol_ID = 5  AND usu.usu_Estado = 1; 
END
GO

-- DDL del Usuarios de Odonto
CREATE OR ALTER PROCEDURE Gral.sp_DDLOdontologos
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        per.per_ID,
        per.per_Nombres + ' ' + per.per_Apellidos AS per_Nombres,
		per.per_Correo
    FROM
        Gral.tbPersonal per LEFT JOIN Acce.tbUsuarios usu 
		ON per.per_ID = usu.per_ID
    WHERE per.per_Estado = 1 AND usu.rol_ID = 2  AND usu.usu_Estado = 1; 
END
GO

-- DDL del Usuarios de Medico
CREATE OR ALTER PROCEDURE Gral.sp_DDLMedicos
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        per.per_ID,
        per.per_Nombres + ' ' + per.per_Apellidos AS per_Nombres,
		per.per_Correo
    FROM
        Gral.tbPersonal per LEFT JOIN Acce.tbUsuarios usu 
		ON per.per_ID = usu.per_ID
    WHERE per.per_Estado = 1 AND usu.rol_ID = 3  AND usu.usu_Estado = 1; 
END
GO

-- DDL del Usuarios de Asesor
CREATE OR ALTER PROCEDURE Gral.sp_DDLAsesor
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        per.per_ID,
        per.per_Nombres + ' ' + per.per_Apellidos AS per_Nombres,
		per.per_Correo
    FROM
        Gral.tbPersonal per LEFT JOIN Acce.tbUsuarios usu 
		ON per.per_ID = usu.per_ID
    WHERE per.per_Estado = 1 AND usu.rol_ID = 4  AND usu.usu_Estado = 1; 
END
GO