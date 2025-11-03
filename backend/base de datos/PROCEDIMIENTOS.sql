---------------------------------------------------  GRAL  -----------------------------------------------------
----------------------------------------------------------------------------------------------------------------
---- LISTAR TODO EL PERSONAL
CREATE OR ALTER PROCEDURE Gral.Personal_Listar
AS
	BEGIN
		SELECT	per.per_ID, 
				per_Nombres, 
				per_Apellidos, 
				CASE 
				WHEN per_EstadoCivil = 'SL' THEN 'Soltero'
				WHEN per_EstadoCivil = 'CS' THEN 'Casado'
				WHEN per_EstadoCivil = 'DV' THEN 'Divorciado'
				WHEN per_EstadoCivil = 'VD' THEN 'Viudo'
				WHEN per_EstadoCivil = 'SP' THEN 'Separado'
				WHEN per_EstadoCivil = 'UL' THEN 'Unión Libre'
				ELSE 'N/A' 
				END AS EstadoCivil,
				per_EstadoCivil, 
				CASE
				WHEN per_Sexo = 'F' THEN 'Femenino'
				WHEN per_Sexo = 'M' THEN 'Masculino'
				ELSE 'N/A'
				END AS Sexo,
				per_Sexo, 
				per_FechaNac, 
				per_Telefono, 
				per_Direccion, 
				per_Correo, 
				are.are_ID,
				are.are_Nombre, 
				usuC.usu_UsuarioCreacion,
				usuC.usu_Usuario AS 'Usuario_C',
				usuC.per_ID AS 'ID_Creador',
				(SELECT personal.per_Nombres + ' ' + personal.per_Apellidos AS 'NombreCompleto_C'
				 FROM Acce.tbUsuarios usuario 
				 INNER JOIN Gral.tbPersonal personal ON usuario.usu_ID = personal.usu_UsuarioCreacion) AS 'NombreCompleto_C',
				per_FechaCreacion, 
				usuM.usu_UsuarioModificacion, 
				usuM.usu_Usuario AS 'Usuario_M',
				usuM.per_ID AS 'ID_Modificador',
				(SELECT personal.per_Nombres + ' ' + personal.per_Apellidos AS 'NombreCompleto_M'
				 FROM Acce.tbUsuarios usuario 
				 LEFT JOIN Gral.tbPersonal personal ON usuario.usu_ID = personal.usu_UsuarioModificacion) AS 'NombreCompleto_M',
				per_FechaModificacion, 
				usuE.usu_UsuarioEliminacion,
				usuE.usu_Usuario AS 'Usuario_E',
				usuE.usu_ID AS 'ID_Eliminador',
				(SELECT personal.per_Nombres + ' ' + personal.per_Apellidos AS 'NombreCompleto_E'
				 FROM Acce.tbUsuarios usuario 
				 LEFT JOIN Gral.tbPersonal personal ON usuario.usu_ID = personal.usu_UsuarioEliminacion) AS 'NombreCompleto_E',
				per_FechaEliminacion, 
				per_Estado
		FROM	Gral.tbPersonal per 
				INNER JOIN Gral.tbAreas are ON per.are_ID = are.are_ID
				INNER JOIN Acce.tbUsuarios usuC ON per.usu_UsuarioCreacion = usuC.usu_ID
				LEFT JOIN Acce.tbUsuarios usuM ON per.usu_UsuarioModificacion = usuM.usu_ID
				LEFT JOIN Acce.tbUsuarios usuE ON per.usu_UsuarioEliminacion = usuE.usu_ID
		WHERE	per_Estado = 1
	END
GO