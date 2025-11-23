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