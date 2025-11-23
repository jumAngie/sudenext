--USE SUDENEXT


---------------------------------------------------  PERSONAL  ----------------------------------------------------
-------------------------------------------------------------------------------------------------------------------
GO
INSERT INTO Gral.tbPersonal (per_Nombres, per_Apellidos, per_EstadoCivil, per_Sexo, per_FechaNac, per_Telefono, per_Direccion, per_Correo, are_ID, usu_UsuarioCreacion, per_FechaCreacion)
VALUES ('María Fernanda', 'Lopez Rivera', 'CS', 'F', '1992-03-05', 99887766, 'Colonia El Carmen, San Pedro Sula', 'maria.lopez@unah.hn', 1, 1, GETDATE());
GO

INSERT INTO Gral.tbPersonal (per_Nombres, per_Apellidos, per_EstadoCivil, per_Sexo, per_FechaNac, per_Telefono, per_Direccion, per_Correo, are_ID, usu_UsuarioCreacion, per_FechaCreacion)
VALUES ('Carlos Eduardo', 'Martinez Mejía', 'SL', 'M', '1988-10-10', 94561234, 'Barrio La Ceiba, Choloma', 'carlos.martinez@unah.hn', 2, 1, GETDATE());
GO

INSERT INTO Gral.tbPersonal (per_Nombres, per_Apellidos, per_EstadoCivil, per_Sexo, per_FechaNac, per_Telefono, per_Direccion, per_Correo, are_ID, usu_UsuarioCreacion, per_FechaCreacion)
VALUES ('Ana Gabriela', 'Castro Flores', 'VD', 'F', '1979-07-25', 98765432, 'Residencial Los Cedros, Tegucigalpa', 'ana.castro@unah.hn', 3, 1, GETDATE());
GO

INSERT INTO Gral.tbPersonal (per_Nombres, per_Apellidos, per_EstadoCivil, per_Sexo, per_FechaNac, per_Telefono, per_Direccion, per_Correo, are_ID, usu_UsuarioCreacion, per_FechaCreacion)
VALUES ('José Manuel', 'Zelaya Ramos', 'DV', 'M', '1990-02-02', 99663322, 'Colonia San José, El Progreso', 'jose.zelaya@unah.hn', 4, 1, GETDATE());
GO

INSERT INTO Gral.tbPersonal (per_Nombres, per_Apellidos, per_EstadoCivil, per_Sexo, per_FechaNac, per_Telefono, per_Direccion, per_Correo, are_ID, usu_UsuarioCreacion, per_FechaCreacion)
VALUES ('Lucía Elena', 'García Torres', 'SP', 'F', '1985-11-19', 93451267, 'Colonia Moderna, La Lima', 'lucia.garcia@unah.hn', 2, 1, GETDATE());
GO

INSERT INTO Gral.tbPersonal (per_Nombres, per_Apellidos, per_EstadoCivil, per_Sexo, per_FechaNac, per_Telefono, per_Direccion, per_Correo, are_ID, usu_UsuarioCreacion, per_FechaCreacion)
VALUES ('Fernando José', 'Ortiz Pineda', 'UL', 'M', '1993-08-03', 98712045, 'Barrio Morazán, Comayagua', 'fernando.ortiz@unah.hn', 1, 1, GETDATE());
GO

INSERT INTO Gral.tbPersonal (per_Nombres, per_Apellidos, per_EstadoCivil, per_Sexo, per_FechaNac, per_Telefono, per_Direccion, per_Correo, are_ID, usu_UsuarioCreacion, per_FechaCreacion)
VALUES ('Paola Andrea', 'Hernández López', 'SL', 'F', '1996-09-22', 97456321, 'Residencial Monte Verde, Choluteca', 'paola.hernandez@unah.hn', 3, 1, GETDATE());
GO

INSERT INTO Gral.tbPersonal (per_Nombres, per_Apellidos, per_EstadoCivil, per_Sexo, per_FechaNac, per_Telefono, per_Direccion, per_Correo, are_ID, usu_UsuarioCreacion, per_FechaCreacion)
VALUES ('Miguel Ángel', 'Perdomo Reyes', 'CS', 'M', '1982-01-12', 96547812, 'Barrio Abajo, Santa Rosa de Copán', 'miguel.perdomo@unah.hn', 4, 1, GETDATE());
GO

INSERT INTO Gral.tbPersonal (per_Nombres, per_Apellidos, per_EstadoCivil, per_Sexo, per_FechaNac, per_Telefono, per_Direccion, per_Correo, are_ID, usu_UsuarioCreacion, per_FechaCreacion)
VALUES ('Isabel Cristina', 'Mejía Romero', 'DV', 'F', '1991-06-14', 98123456, 'Colonia Altamira, Danlí', 'isabel.mejia@unah.hn', 2, 1, GETDATE());
GO

INSERT INTO Gral.tbPersonal (per_Nombres, per_Apellidos, per_EstadoCivil, per_Sexo, per_FechaNac, per_Telefono, per_Direccion, per_Correo, are_ID, usu_UsuarioCreacion, per_FechaCreacion)
VALUES ('Ricardo Antonio', 'Flores Aguilar', 'UL', 'M', '1987-04-30', 97561234, 'Colonia El Prado, Tegucigalpa', 'ricardo.flores@unah.hn', 1, 1, GETDATE());
GO
---------------------------------------------------  TIPO CONSULTA  ----------------------------------------------------
----------------------------------------------------------------------------------------------------------------
INSERT INTO [Acad].[tbTipoConsulta] 
	  (tic_Descripcion, usu_UsuarioCreacion, tic_FechaCreacion)
VALUES ('Planificación Académica', 1, GETDATE())
GO
INSERT INTO [Acad].[tbTipoConsulta] 
	  (tic_Descripcion, usu_UsuarioCreacion, tic_FechaCreacion)
VALUES ('Cambio de Carrera', 1, GETDATE())
GO
INSERT INTO [Acad].[tbTipoConsulta] 
	  (tic_Descripcion, usu_UsuarioCreacion, tic_FechaCreacion)
VALUES ('Problemas de Rendimiento', 1, GETDATE())
GO
INSERT INTO [Acad].[tbTipoConsulta] 
	  (tic_Descripcion, usu_UsuarioCreacion, tic_FechaCreacion)
VALUES ('Orientación Vocacional', 1, GETDATE())
GO
INSERT INTO [Acad].[tbTipoConsulta] 
	  (tic_Descripcion, usu_UsuarioCreacion, tic_FechaCreacion)
VALUES ('Trámites Académicos', 1, GETDATE())
GO
INSERT INTO [Acad].[tbTipoConsulta] 
	  (tic_Descripcion, usu_UsuarioCreacion, tic_FechaCreacion)
VALUES ('Becas y Ayudas', 1, GETDATE())
GO
INSERT INTO [Acad].[tbTipoConsulta] 
	  (tic_Descripcion, usu_UsuarioCreacion, tic_FechaCreacion)
VALUES ('Intercambios', 1, GETDATE())
GO
INSERT INTO [Acad].[tbTipoConsulta] 
	  (tic_Descripcion, usu_UsuarioCreacion, tic_FechaCreacion)
VALUES ('Práctica Profesional', 1, GETDATE())
GO
INSERT INTO [Acad].[tbTipoConsulta] 
	  (tic_Descripcion, usu_UsuarioCreacion, tic_FechaCreacion)
VALUES ('Tesis/Trabajo de Graduación', 1, GETDATE())
GO
INSERT INTO [Acad].[tbTipoConsulta] 
	  (tic_Descripcion, usu_UsuarioCreacion, tic_FechaCreacion)
VALUES ('Otro', 1, GETDATE())
GO
---------------------------------------------------  TRATAMIENTOS  ----------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------
INSERT INTO [Odon].[tbTratamientos]
	  (tra_Descripcion, usu_UsuarioCreacion, tra_FechaCreacion)
VALUES ('Limpieza Dental', 1, GETDATE())
GO
INSERT INTO [Odon].[tbTratamientos]
	  (tra_Descripcion, usu_UsuarioCreacion, tra_FechaCreacion)
VALUES ('Empaste/Obturación', 1, GETDATE())
GO
INSERT INTO [Odon].[tbTratamientos]
	  (tra_Descripcion, usu_UsuarioCreacion, tra_FechaCreacion)
VALUES ('Endodoncia', 1, GETDATE())
GO
INSERT INTO [Odon].[tbTratamientos]
	  (tra_Descripcion, usu_UsuarioCreacion, tra_FechaCreacion)
VALUES ('Extracción', 1, GETDATE())
GO
INSERT INTO [Odon].[tbTratamientos]
	  (tra_Descripcion, usu_UsuarioCreacion, tra_FechaCreacion)
VALUES ('Corona Dental', 1, GETDATE())
GO
INSERT INTO [Odon].[tbTratamientos]
	  (tra_Descripcion, usu_UsuarioCreacion, tra_FechaCreacion)
VALUES ('Blanqueamiento', 1, GETDATE())
GO
INSERT INTO [Odon].[tbTratamientos]
	  (tra_Descripcion, usu_UsuarioCreacion, tra_FechaCreacion)
VALUES ('Ortodoncia', 1, GETDATE())
GO
INSERT INTO [Odon].[tbTratamientos]
	  (tra_Descripcion, usu_UsuarioCreacion, tra_FechaCreacion)
VALUES ('Cirugía Oral', 1, GETDATE())
GO
INSERT INTO [Odon].[tbTratamientos]
	  (tra_Descripcion, usu_UsuarioCreacion, tra_FechaCreacion)
VALUES ('Tratamiento de Encías', 1, GETDATE())
GO
INSERT INTO [Odon].[tbTratamientos]
	  (tra_Descripcion, usu_UsuarioCreacion, tra_FechaCreacion)
VALUES ('Protesís Dental', 1, GETDATE())
GO
---------------------------------------------------  ROLES  ------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------
INSERT INTO [Acce].[tbRoles]
		(rol_Descripcion, usu_UsuarioCreacion, rol_FechaCreacion)
VALUES	('Odontologo',			1,				GETDATE())
GO
INSERT INTO [Acce].[tbRoles]
		(rol_Descripcion, usu_UsuarioCreacion, rol_FechaCreacion)
VALUES	('Medico General',			1,				GETDATE())
GO
INSERT INTO [Acce].[tbRoles]
		(rol_Descripcion, usu_UsuarioCreacion, rol_FechaCreacion)
VALUES	('Asesor Académico',			1,				GETDATE())
GO
INSERT INTO [Acce].[tbRoles]
		(rol_Descripcion, usu_UsuarioCreacion, rol_FechaCreacion)
VALUES	('Consejero',			1,				GETDATE())
GO

---------------------------------------------------  USUARIOS  ----------------------------------------------------
-------------------------------------------------------------------------------------------------------------------
DECLARE @Pass AS VARCHAR(255), @Clave AS VARCHAR(255);
SET @Clave = 'NO1';
SET @Pass = CONVERT(VARCHAR(255), HASHBYTES('SHA2_256', @Clave), 2)

INSERT INTO Acce.tbUsuarios	(usu_Usuario,     usu_Contrasena,		per_ID,		rol_ID,   usu_UsuarioCreacion, usu_FechaCreacion, usu_Estado)
VALUES						('ricardo.flores@unah.hn',			@Pass,		11, 		4,			1,						GETDATE(),			1);
GO

DECLARE @Pass AS VARCHAR(255), @Clave AS VARCHAR(255);
SET @Clave = 'NO2';
SET @Pass = CONVERT(VARCHAR(255), HASHBYTES('SHA2_256', @Clave), 2)

INSERT INTO Acce.tbUsuarios	(usu_Usuario,     usu_Contrasena,		per_ID,		rol_ID,   usu_UsuarioCreacion, usu_FechaCreacion, usu_Estado)
VALUES						('jose.zelaya@unah.hn',			@Pass,		5, 		3,			1,						GETDATE(),			1);
GO

DECLARE @Pass AS VARCHAR(255), @Clave AS VARCHAR(255);
SET @Clave = 'NO3';
SET @Pass = CONVERT(VARCHAR(255), HASHBYTES('SHA2_256', @Clave), 2)

INSERT INTO Acce.tbUsuarios	(usu_Usuario,     usu_Contrasena,		per_ID,		rol_ID,   usu_UsuarioCreacion, usu_FechaCreacion, usu_Estado)
VALUES						('ana.castro@unah.hn',			@Pass,		4, 		2,			1,						GETDATE(),			1);
GO

DECLARE @Pass AS VARCHAR(255), @Clave AS VARCHAR(255);
SET @Clave = 'NO4';
SET @Pass = CONVERT(VARCHAR(255), HASHBYTES('SHA2_256', @Clave), 2)

INSERT INTO Acce.tbUsuarios	(usu_Usuario,     usu_Contrasena,		per_ID,		rol_ID,   usu_UsuarioCreacion, usu_FechaCreacion, usu_Estado)
VALUES						('carlos.martinez@unah.hn',			@Pass,		3, 		5,			1,						GETDATE(),			1);
GO

DECLARE @Pass AS VARCHAR(255), @Clave AS VARCHAR(255);
SET @Clave = 'NO5';
SET @Pass = CONVERT(VARCHAR(255), HASHBYTES('SHA2_256', @Clave), 2)

INSERT INTO Acce.tbUsuarios	(usu_Usuario,     usu_Contrasena,		per_ID,		rol_ID,   usu_UsuarioCreacion, usu_FechaCreacion, usu_Estado)
VALUES						('lucia.garcia@unah.hn',			@Pass,		6, 		1,			1,						GETDATE(),			1);
GO