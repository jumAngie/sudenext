--DROP DATABASE SUDENEXT
--CREATE DATABASE SUDENEXT
--USE SUDENEXT

CREATE SCHEMA Acce
GO
CREATE SCHEMA Gral
GO
CREATE SCHEMA Med
GO
CREATE SCHEMA Psi
GO
CREATE SCHEMA Acad
GO
CREATE SCHEMA Odon
GO

---------------------------------------------------  ACCE  -----------------------------------------------------
----------------------------------------------------------------------------------------------------------------
-- Tabla de Usuarios
CREATE TABLE Acce.tbUsuarios
(
	usu_ID				INT IDENTITY(1,1),
	usu_Usuario			NVARCHAR(80)		NOT NULL,
	usu_Contrasena		NVARCHAR(255)		NOT NULL,
	per_ID				INT,
	rol_ID				INT,

	usu_UsuarioCreacion				INT NOT NULL,
	usu_FechaCreacion			    DATETIME NOT NULL,
	usu_UsuarioModificacion 		INT DEFAULT NULL,
	usu_FechaModificacion		    DATETIME DEFAULT NULL,
	usu_UsuarioEliminacion			INT	DEFAULT NULL,
	usu_FechaEliminacion			DATETIME DEFAULT NULL,
	usu_Estado 				        BIT DEFAULT 1

	CONSTRAINT PK_Acce_tbUsuarios_usu_ID	PRIMARY KEY (usu_ID),
	CONSTRAINT FK_Acce_tbUsuarios_usu_UsuarioCreacion_Acce_tbUsuarios_usu_ID FOREIGN KEY(usu_UsuarioCreacion) REFERENCES Acce.tbUsuarios(usu_ID),
	CONSTRAINT FK_Acce_tbUsuarios_usu_UsuarioModificacion_Acce_tbUsuarios_usu_ID FOREIGN KEY(usu_UsuarioModificacion) REFERENCES Acce.tbUsuarios(usu_ID),
	CONSTRAINT FK_Acce_tbUsuarios_usu_UsuarioEliminacion_Acce_tbUsuarios_usu_ID FOREIGN KEY(usu_UsuarioEliminacion) REFERENCES Acce.tbUsuarios(usu_ID)
);
GO
DECLARE @Pass AS VARCHAR(255), @Clave AS VARCHAR(255);
SET @Clave = '0987654321';
SET @Pass = CONVERT(VARCHAR(255), HASHBYTES('SHA2_256', @Clave), 2)

INSERT INTO Acce.tbUsuarios	(usu_Usuario,     usu_Contrasena,		per_ID,		rol_ID,   usu_UsuarioCreacion, usu_FechaCreacion, usu_Estado)
VALUES						('luis.sab@unah.hn',			@Pass,		1, 		1,			1,						GETDATE(),			1);
GO

CREATE TABLE Acce.tbPantallas
(
	pan_ID				INT IDENTITY(1,1),
	pan_Nombre			VARCHAR(25),
	pan_URL				NVARCHAR(255),
	pan_Identificador	VARCHAR(5),
	pan_Icono			VARCHAR(15),
	
	usu_UsuarioCreacion				INT NOT NULL,
	pan_FechaCreacion			    DATETIME NOT NULL,
	usu_UsuarioModificacion 		INT DEFAULT NULL,
	pan_FechaModificacion		    DATETIME DEFAULT NULL,
	usu_UsuarioEliminacion			INT	DEFAULT NULL,
	pan_FechaEliminacion			DATETIME DEFAULT NULL,
	pan_Estado 				        BIT DEFAULT 1

	CONSTRAINT PK_Acce_tbPantallas_pan_ID	PRIMARY KEY (pan_ID),
	CONSTRAINT FK_Acce_tbPantallas_usu_UsuarioCreacion_Acce_tbUsuarios_usu_ID FOREIGN KEY(usu_UsuarioCreacion) REFERENCES Acce.tbUsuarios(usu_ID),
	CONSTRAINT FK_Acce_tbPantallas_usu_UsuarioModificacion_Acce_tbUsuarios_usu_ID FOREIGN KEY(usu_UsuarioModificacion) REFERENCES Acce.tbUsuarios(usu_ID),
	CONSTRAINT FK_Acce_tbPantallas_usu_UsuarioEliminacion_Acce_tbUsuarios_usu_ID FOREIGN KEY(usu_UsuarioEliminacion) REFERENCES Acce.tbUsuarios(usu_ID)
);
-- Tabla de Roles
CREATE TABLE Acce.tbRoles
(
	rol_ID			INT IDENTITY(1,1),
	rol_Descripcion	NVARCHAR(30),

	usu_UsuarioCreacion				INT NOT NULL,
	rol_FechaCreacion			    DATETIME NOT NULL,
	usu_UsuarioModificacion 		INT DEFAULT NULL,
	rol_FechaModificacion		    DATETIME DEFAULT NULL,
	usu_UsuarioEliminacion			INT	DEFAULT NULL,
	rol_FechaEliminacion			DATETIME DEFAULT NULL,
	rol_Estado 				        BIT DEFAULT 1

	CONSTRAINT PK_Acce_tbRoles_rol_ID			PRIMARY KEY (rol_ID),
	CONSTRAINT UQ_Acce_tbRoles_rol_Descripcion	UNIQUE (rol_Descripcion),
	CONSTRAINT FK_Acce_tbRoles_usu_UsuarioCreacion_Acce_tbUsuarios_usu_ID		FOREIGN KEY(usu_UsuarioCreacion)		REFERENCES Acce.tbUsuarios(usu_ID),
	CONSTRAINT FK_Acce_tbRoles_usu_UsuarioModificacion_Acce_tbUsuarios_usu_ID	FOREIGN KEY(usu_UsuarioModificacion)	REFERENCES Acce.tbUsuarios(usu_ID),
	CONSTRAINT FK_Acce_tbRoles_usu_UsuarioEliminacion_Acce_tbUsuarios_usu_ID	FOREIGN KEY(usu_UsuarioEliminacion)		REFERENCES Acce.tbUsuarios(usu_ID)
);
GO
INSERT INTO Acce.tbRoles (rol_Descripcion, usu_UsuarioCreacion, rol_FechaCreacion)
VALUES					 ('Administrador',		1,				GETDATE());

GO
 ALTER TABLE Acce.tbUsuarios
 ADD CONSTRAINT FK_Acce_tbUsuarios_rol_ID_Acce_tbRoles_rol_ID FOREIGN KEY(rol_ID) REFERENCES Acce.tbRoles(rol_ID)
 GO

-- Tabla de Roles por Pantallas
CREATE TABLE Acce.tbRolesXPantallas
(
		rop_ID		INT IDENTITY(1,1),
		rol_ID		INT,
		pan_ID		INT,

		usu_UsuarioCreacion				INT NOT NULL,
		rop_FechaCreacion			    DATETIME NOT NULL,
		usu_UsuarioModificacion 		INT DEFAULT NULL,
		rop_FechaModificacion		    DATETIME DEFAULT NULL,
		usu_UsuarioEliminacion			INT	DEFAULT NULL,
		rop_FechaEliminacion			DATETIME DEFAULT NULL,
		rop_Estado 				        BIT DEFAULT 1

		CONSTRAINT PK_Acce_tbRolesxPantallas_rop_ID PRIMARY KEY(rop_ID),
		CONSTRAINT FK_Acce_tbRolesxPantallas_rol_ID_Acce_tbRoles_rol_ID FOREIGN KEY (rol_ID) REFERENCES Acce.tbRoles (rol_ID),
		CONSTRAINT FK_Acce_tbRolesxPantallas_pan_ID_Acce_tbPantallas_pan_ID FOREIGN KEY (pan_ID) REFERENCES Acce.tbPantallas (pan_ID),
		CONSTRAINT FK_Acce_tbRolesXPantallas_usu_UsuarioCreacion_Acce_tbUsuarios_usu_ID		FOREIGN KEY(usu_UsuarioCreacion)		REFERENCES Acce.tbUsuarios(usu_ID),
		CONSTRAINT FK_Acce_tbRolesXPantallas_usu_UsuarioModificacion_Acce_tbUsuarios_usu_ID	FOREIGN KEY(usu_UsuarioModificacion)	REFERENCES Acce.tbUsuarios(usu_ID),
		CONSTRAINT FK_Acce_tbRolesXPantallas_usu_UsuarioEliminacion_Acce_tbUsuarios_usu_ID	FOREIGN KEY(usu_UsuarioEliminacion)		REFERENCES Acce.tbUsuarios(usu_ID)
);
---------------------------------------------------  GRAL  -----------------------------------------------------
----------------------------------------------------------------------------------------------------------------
-- Tabla de Areas
CREATE TABLE Gral.tbAreas
(	
	are_ID			INT IDENTITY(1,1),
	are_Nombre		VARCHAR(25)			NOT NULL,

	usu_UsuarioCreacion				INT NOT NULL,
	are_FechaCreacion			    DATETIME NOT NULL,
	usu_UsuarioModificacion 		INT DEFAULT NULL,
	are_FechaModificacion		    DATETIME DEFAULT NULL,
	usu_UsuarioEliminacion			INT	DEFAULT NULL,
	are_FechaEliminacion			DATETIME DEFAULT NULL,
	are_Estado 				        BIT DEFAULT 1

	CONSTRAINT PK_Gral_tbAreas_are_ID PRIMARY KEY(are_ID),
	CONSTRAINT UQ_Gral_tbAreas_are_Nombre UNIQUE (are_Nombre),
	CONSTRAINT FK_Gral_tbAreas_usu_UsuarioCreacion_Acce_tbUsuarios_usu_ID		FOREIGN KEY(usu_UsuarioCreacion)		REFERENCES Acce.tbUsuarios(usu_ID),
	CONSTRAINT FK_Gral_tbAreas_usu_UsuarioModificacion_Acce_tbUsuarios_usu_ID	FOREIGN KEY(usu_UsuarioModificacion)	REFERENCES Acce.tbUsuarios(usu_ID),
	CONSTRAINT FK_Gral_tbAreas_usu_UsuarioEliminacion_Acce_tbUsuarios_usu_ID	FOREIGN KEY(usu_UsuarioEliminacion)		REFERENCES Acce.tbUsuarios(usu_ID)
);
GO
INSERT INTO [Gral].[tbAreas] 
	  (are_Nombre, usu_UsuarioCreacion, are_FechaCreacion)
VALUES ('Asesoría Académica', 1, GETDATE())
GO
INSERT INTO [Gral].[tbAreas] 
	  (are_Nombre, usu_UsuarioCreacion, are_FechaCreacion)
VALUES ('Psicología', 1, GETDATE())
GO
INSERT INTO [Gral].[tbAreas] 
	  (are_Nombre, usu_UsuarioCreacion, are_FechaCreacion)
VALUES ('Odontología', 1, GETDATE())
GO
INSERT INTO [Gral].[tbAreas] 
	  (are_Nombre, usu_UsuarioCreacion, are_FechaCreacion)
VALUES ('Medicina General', 1, GETDATE())
GO

-- Tabla de Estudiantes
CREATE TABLE Gral.tbEstudiantes
(
	est_ID				INT IDENTITY(1,1),
	est_NumeroCuenta	VARCHAR(11)		NOT NULL,
	est_NombreCompleto	NVARCHAR(200)	NOT NULL,
	est_Contra			VARCHAR(255)	NOT NULL,
	est_Correo			NVARCHAR(50)	NOT NULL,
	est_Celular			VARCHAR(20)		NOT NULL,
	est_Carrera			NVARCHAR(50)	NOT NULL,
	est_EstadoM			BIT				NOT NULL,

	usu_UsuarioCreacion				INT NOT NULL,
	est_FechaCreacion			    DATETIME NOT NULL,
	usu_UsuarioModificacion 		INT DEFAULT NULL,
	est_FechaModificacion		    DATETIME DEFAULT NULL,
	usu_UsuarioEliminacion			INT	DEFAULT NULL,
	est_FechaEliminacion			DATETIME DEFAULT NULL,
	est_Estado 				        BIT DEFAULT 1
	
	CONSTRAINT PK_Gral_tbEstudiantes_est_ID  PRIMARY KEY (est_ID),
	CONSTRAINT UQ_Gral_tbEstudiantes_est_NumeroCuenta UNIQUE (est_NumeroCuenta),
	CONSTRAINT FK_Gral_tbEstudiantes_usu_UsuarioCreacion_Acce_tbUsuarios_usu_ID		FOREIGN KEY(usu_UsuarioCreacion)		REFERENCES Acce.tbUsuarios(usu_ID),
	CONSTRAINT FK_Gral_tbEstudiantes_usu_UsuarioModificacion_Acce_tbUsuarios_usu_ID	FOREIGN KEY(usu_UsuarioModificacion)	REFERENCES Acce.tbUsuarios(usu_ID),
	CONSTRAINT FK_Gral_tbEstudiantes_usu_UsuarioEliminacion_Acce_tbUsuarios_usu_ID	FOREIGN KEY(usu_UsuarioEliminacion)		REFERENCES Acce.tbUsuarios(usu_ID)
);
GO
DECLARE @Pass AS VARCHAR(255), @Clave AS VARCHAR(255);
SET @Clave = '0124';
SET @Pass = CONVERT(VARCHAR(255), HASHBYTES('SHA2_256', @Clave), 2)
INSERT INTO Gral.tbEstudiantes(est_NumeroCuenta,	est_NombreCompleto,		est_Contra,	est_Correo,				est_Celular, est_Carrera,				est_EstadoM, usu_UsuarioCreacion, est_FechaCreacion)
VALUES						  ('20222000215',	'Angie Yahaira Campos Arias', @Pass, 'angie.campos@unah.hn', '95887062', 'Informática Administrativa',	 1,				1,					GETDATE());
GO

-- Tabla de Personal
CREATE TABLE Gral.tbPersonal
(
		per_ID				INT IDENTITY(1,1),
		per_Nombres			NVARCHAR(255)	NOT NULL,
		per_Apellidos		NVARCHAR(255)	NOT NULL,
		per_EstadoCivil		CHAR(2)			NOT NULL,
		per_Sexo			CHAR(1)			NOT NULL,
		per_FechaNac		DATE			NOT NULL,
		per_Telefono		VARCHAR(15)		NOT NULL,
		per_Direccion		NVARCHAR(200)	NOT NULL,
		per_Correo			NVARCHAR(80)	NOT NULL,
		are_ID				INT,

		usu_UsuarioCreacion				INT NOT NULL,
		per_FechaCreacion			    DATETIME NOT NULL,
		usu_UsuarioModificacion 		INT DEFAULT NULL,
		per_FechaModificacion		    DATETIME DEFAULT NULL,
		usu_UsuarioEliminacion			INT	DEFAULT NULL,
		per_FechaEliminacion			DATETIME DEFAULT NULL,
		per_Estado 				        BIT DEFAULT 1

		CONSTRAINT PK_Gral_tbPersonal_per_ID			    PRIMARY KEY	(per_ID),
		CONSTRAINT CK_Gral_tbPersonal_per_EstadoCivil		CHECK		(per_EstadoCivil IN('SL','CS', 'DV', 'VD', 'UL', 'SP')),
		CONSTRAINT CK_Gral_tbPersonal_per_Sexo				CHECK		(per_Sexo IN('F', 'M')),
		CONSTRAINT UQ_Gral_tbPersonal_per_Telefono			UNIQUE		(per_Telefono),
		CONSTRAINT UQ_Gral_tbPersonal_per_Correo			UNIQUE		(per_Correo),
		CONSTRAINT FK_Gral_tbPersonal_are_ID_Gral_tbAreas_are_ID		FOREIGN KEY (are_ID) REFERENCES Gral.tbAreas(are_ID),
		CONSTRAINT FK_Gral_tbPersonal_usu_UsuarioCreacion_Acce_tbUsuarios_usu_ID		FOREIGN KEY(usu_UsuarioCreacion)		REFERENCES Acce.tbUsuarios(usu_ID),
		CONSTRAINT FK_Gral_tbPersonal_usu_UsuarioModificacion_Acce_tbUsuarios_usu_ID	FOREIGN KEY(usu_UsuarioModificacion)	REFERENCES Acce.tbUsuarios(usu_ID),
		CONSTRAINT FK_Gral_tbPersonal_usu_UsuarioEliminacion_Acce_tbUsuarios_usu_ID	FOREIGN KEY(usu_UsuarioEliminacion)		REFERENCES Acce.tbUsuarios(usu_ID)
);
GO
INSERT INTO Gral.tbPersonal   (per_Nombres,		per_Apellidos,		per_EstadoCivil, per_Sexo, per_FechaNac, per_Telefono,		per_Direccion,				per_Correo,     are_ID, usu_UsuarioCreacion, per_FechaCreacion)
VALUES						  ('Luis Alejandro','Sabillón Perez',		'SL',			'M',    '12-12-1995',  98987575, 'Colonia Los Pinos, La Lima',	'luis.sab@unah.hn',		2,			1,				GETDATE());
GO
 ALTER TABLE Acce.tbUsuarios
 ADD CONSTRAINT FK_Acce_tbUsuarios_per_ID_Gral_tbPersonal_per_ID FOREIGN KEY(per_ID) REFERENCES Gral.tbPersonal(per_ID)
 GO

---------------------------------------------------  ACAD  -----------------------------------------------------
----------------------------------------------------------------------------------------------------------------
-- Tabla de tipos de consultas academicas
CREATE TABLE Acad.tbTipoConsulta
(
		tic_ID	INT IDENTITY(1,1),
		tic_Descripcion	NVARCHAR(80)	NOT NULL,

		usu_UsuarioCreacion				INT NOT NULL,
		tic_FechaCreacion			    DATETIME NOT NULL,
		usu_UsuarioModificacion 		INT DEFAULT NULL,
		tic_FechaModificacion		    DATETIME DEFAULT NULL,
		usu_UsuarioEliminacion			INT	DEFAULT NULL,
		tic_FechaEliminacion			DATETIME DEFAULT NULL,
		tic_Estado 				        BIT DEFAULT 1

		CONSTRAINT PK_Acad_tbTipoConsulta_tic_ID	PRIMARY KEY (tic_ID),
		CONSTRAINT FK_Acad_tbTipoConsulta_usu_UsuarioCreacion_Acce_tbUsuarios_usu_ID		FOREIGN KEY(usu_UsuarioCreacion)		REFERENCES Acce.tbUsuarios(usu_ID),
		CONSTRAINT FK_Acad_tbTipoConsulta_usu_UsuarioModificacion_Acce_tbUsuarios_usu_ID	FOREIGN KEY(usu_UsuarioModificacion)	REFERENCES Acce.tbUsuarios(usu_ID),
		CONSTRAINT FK_Acad_tbTipoConsulta_usu_UsuarioEliminacion_Acce_tbUsuarios_usu_ID		FOREIGN KEY(usu_UsuarioEliminacion)		REFERENCES Acce.tbUsuarios(usu_ID)
);

--- Tabla de Consultas Academicas
CREATE TABLE Acad.tbConsultasAcademicas
(
	coa_ID				INT IDENTITY(1,1),
	est_ID				INT,
	tic_ID				INT,
	coa_Descripcion		NVARCHAR(MAX)	NOT NULL,
	coa_Recomendacion	NVARCHAR(255),
	coa_Seguimiento		BIT DEFAULT 0,

    usu_UsuarioCreacion				INT NOT NULL,
    coa_FechaCreacion        DATETIME NOT NULL,
    usu_UsuarioModificacion  INT     NULL,
    coa_FechaModificacion    DATETIME NULL,
    usu_UsuarioEliminacion   INT     NULL,
    coa_FechaEliminacion     DATETIME NULL,
    coa_Estado               BIT DEFAULT 1,


	CONSTRAINT PK_Acad_tbConsultasAcademicas_coa_ID	PRIMARY KEY(coa_ID),
	CONSTRAINT FK_Acad_tbConsultasAcademicas_est_ID_Gral_tbEstudiantes_est_ID	FOREIGN KEY(est_ID) REFERENCES Gral.tbEstudiantes(est_ID),
	CONSTRAINT FK_Acad_tbConsultasAcademicas_tic_ID_Acad_tbTipoConsulta_tic_ID	FOREIGN KEY(tic_ID) REFERENCES Acad.tbTipoConsulta(tic_ID),
	CONSTRAINT FK_Acad_tbConsultasAcademicas_UsuarioCreacion_Acce_tbUsuarios_usu_ID FOREIGN KEY(usu_UsuarioCreacion) REFERENCES Acce.tbUsuarios(usu_ID),
    CONSTRAINT FK_Acad_tbConsultasAcademicas_UsuarioModificacion_Acce_tbUsuarios_usu_ID FOREIGN KEY(usu_UsuarioModificacion) REFERENCES Acce.tbUsuarios(usu_ID),
    CONSTRAINT FK_Acad_tbConsultasAcademicas_UsuarioEliminacion_Acce_tbUsuarios_usu_ID FOREIGN KEY(usu_UsuarioEliminacion) REFERENCES Acce.tbUsuarios(usu_ID)
);
---------------------------------------------------  ODON  ----------------------------------------------------
----------------------------------------------------------------------------------------------------------------
--- Tabla de Solicitudes de Cita Odontologica
CREATE TABLE Odon.tbSolicitudCitaOdon
(
	sco_ID			INT IDENTITY(1,1),
	est_ID			INT,
	sco_FechaP		DATE				NOT NULL,
	sco_Hora		VARCHAR(10),
	sco_Motivo		NVARCHAR(255)		NOT NULL,
	sco_Prioridad	CHAR(1) DEFAULT 'B' NOT NULL,
	sco_Cancelar	BIT DEFAULT 0		NULL,
	sco_FechaCancelacion     DATETIME   NULL,
    
	
    sco_FechaCreacion        DATETIME NOT NULL,
    sco_FechaModificacion    DATETIME NULL,
    sco_FechaEliminacion     DATETIME NULL,
    sco_Estado               BIT DEFAULT 1,
	sco_Asignada			 BIT DEFAULT 0,

	CONSTRAINT PK_Odon_tbSolicitudCitaOdon_sco_ID	PRIMARY KEY(sco_ID),
	CONSTRAINT FK_Odon_tbSolicitudCitaOdon_est_ID_Gral_tbEstudiantes_est_ID FOREIGN KEY(est_ID) REFERENCES Gral.tbEstudiantes(est_ID),
	CONSTRAINT CK_Odon_tbSolicitudCitaOdon_sco_Prioridad CHECK(sco_Prioridad IN('B','M','A'))
);

--- Tabla de Asignación de Citas Odontologicas
CREATE TABLE Odon.tbSolicitudOdonAsignada
(
		sca_ID		INT IDENTITY (1,1),
		sco_ID		INT,
		per_ID		INT,
		sca_Cancel	BIT DEFAULT 0,

		usu_UsuarioCreacion      INT     NOT NULL,
		sca_FechaCreacion        DATETIME NOT NULL,
		usu_UsuarioModificacion  INT     NULL,
		sca_FechaModificacion    DATETIME NULL,
		usu_UsuarioEliminacion   INT     NULL,
		sca_FechaEliminacion     DATETIME NULL,
		sca_Estado               BIT DEFAULT 1,
	
	CONSTRAINT PK_Odon_tbSolicitudOdonAsignada_sca_ID PRIMARY KEY (sca_ID),
	CONSTRAINT FK_Odon_tbSolicitudOdonAsignada_sco_ID_Odon_tbSolicitudCitaOdon_sco_ID		FOREIGN KEY(sco_ID) REFERENCES Odon.tbSolicitudCitaOdon(sco_ID),
	CONSTRAINT FK_Odon_tbSolicitudOdonAsignada_per_ID_Gral_tbPersonal_per_ID				FOREIGN KEY(per_ID) REFERENCES Gral.tbPersonal(per_ID),
	CONSTRAINT FK_Odon_tbSolicitudOdonAsignada_UsuarioCreacion_Acce_tbUsuarios_usu_ID		FOREIGN KEY(usu_UsuarioCreacion) REFERENCES Acce.tbUsuarios(usu_ID),
    CONSTRAINT FK_Odon_tbSolicitudOdonAsignada_UsuarioModificacion_Acce_tbUsuarios_usu_ID	FOREIGN KEY(usu_UsuarioModificacion) REFERENCES Acce.tbUsuarios(usu_ID),
    CONSTRAINT FK_Odon_tbSolicitudOdonAsignada_UsuarioEliminacion_Acce_tbUsuarios_usu_ID	FOREIGN KEY(usu_UsuarioEliminacion) REFERENCES Acce.tbUsuarios(usu_ID)
);

--- Tabla de Tratamientos disponibles
CREATE TABLE Odon.tbTratamientos
(
	tra_ID	INT IDENTITY(1,1),
	tra_Descripcion	NVARCHAR(100)	NOT NULL,

	usu_UsuarioCreacion      INT     NOT NULL,
    tra_FechaCreacion        DATETIME NOT NULL,
    usu_UsuarioModificacion  INT     NULL,
    tra_FechaModificacion    DATETIME NULL,
    usu_UsuarioEliminacion   INT     NULL,
    tra_FechaEliminacion     DATETIME NULL,
    tra_Estado               BIT DEFAULT 1,

	CONSTRAINT PK_Odon_tbTratamientos_tra_ID	PRIMARY KEY(tra_ID),
	CONSTRAINT FK_Odon_tbTratamientos_UsuarioCreacion_Acce_tbUsuarios_usu_ID FOREIGN KEY(usu_UsuarioCreacion) REFERENCES Acce.tbUsuarios(usu_ID),
    CONSTRAINT FK_Odon_tbTratamientos_UsuarioModificacion_Acce_tbUsuarios_usu_ID FOREIGN KEY(usu_UsuarioModificacion) REFERENCES Acce.tbUsuarios(usu_ID),
    CONSTRAINT FK_Odon_tbTratamientos_UsuarioEliminacion_Acce_tbUsuarios_usu_ID FOREIGN KEY(usu_UsuarioEliminacion) REFERENCES Acce.tbUsuarios(usu_ID)
);

-- Tabla de Tratamiento diagnosticado
CREATE TABLE Odon.tbDiagnosticoOdonto
(
	trd_ID				INT IDENTITY(1,1),
	est_ID				INT,
	tra_ID				INT,
	trd_Descripcion		NVARCHAR(MAX)	NOT NULL,
	trd_Diagnostico		NVARCHAR(255)	NOT NULL,
	trd_Duracion		INT				NOT NULL,
	trd_Costo			DECIMAL(10,2)	NOT NULL,
	trd_Seguimiento		BIT DEFAULT 0,
	trd_FechaSeg		DATE,
	trd_Instrucciones	NVARCHAR(255),
	trd_Observaciones	NVARCHAR(255),
	
	usu_UsuarioCreacion				INT NOT NULL,
	trd_FechaCreacion			    DATETIME NOT NULL,
	usu_UsuarioModificacion 		INT DEFAULT NULL,
	trd_FechaModificacion		    DATETIME DEFAULT NULL,
	usu_UsuarioEliminacion			INT	DEFAULT NULL,
	trd_FechaEliminacion			DATETIME DEFAULT NULL,
	trd_Estado 				        BIT DEFAULT 1

	CONSTRAINT PK_Odon_tbTratamientoDiagnosticado_trd_ID PRIMARY KEY(trd_ID),
	CONSTRAINT FK_Odon_tbTratamientoDiagnosticado_est_ID_Gral_tbEstudiantes_est_ID FOREIGN KEY(est_ID) REFERENCES Gral.tbEstudiantes(est_ID),
	CONSTRAINT FK_odon_tbTratamientoDiagnosticado_tra_ID_Odon_tbTratamientos_tra_ID	FOREIGN KEY(tra_ID) REFERENCES Odon.tbTratamientos(tra_ID),
	CONSTRAINT FK_Odon_tbDiagnosticoOdonto_UsuarioCreacion_Acce_tbUsuarios_usu_ID FOREIGN KEY(usu_UsuarioCreacion) REFERENCES Acce.tbUsuarios(usu_ID),
    CONSTRAINT FK_Odon_tbDiagnosticoOdonto_UsuarioModificacion_Acce_tbUsuarios_usu_ID FOREIGN KEY(usu_UsuarioModificacion) REFERENCES Acce.tbUsuarios(usu_ID),
    CONSTRAINT FK_Odon_tbDiagnosticoOdonto_UsuarioEliminacion_Acce_tbUsuarios_usu_ID FOREIGN KEY(usu_UsuarioEliminacion) REFERENCES Acce.tbUsuarios(usu_ID)
);
-----------------------------------------Med---------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------
CREATE TABLE Med.tbDiagnosticosMedicos
(
    dia_ID INT IDENTITY (1,1),
	est_ID	INT,
    dia_DiagnosticoPrin NVARCHAR (200) NULL,

	usu_UsuarioCreacion				INT NOT NULL,
	dia_FechaCreacion			    DATETIME NOT NULL,
	usu_UsuarioModificacion 		INT DEFAULT NULL,
	dia_FechaModificacion		    DATETIME DEFAULT NULL,
	usu_UsuarioEliminacion			INT	DEFAULT NULL,
	dia_FechaEliminacion			DATETIME DEFAULT NULL,
	dia_Estado 				        BIT DEFAULT 1

    CONSTRAINT PK_Med_tbDiagnosticosMedicos_dia_ID PRIMARY KEY (dia_ID),
	CONSTRAINT FK_Med_tbDiagnosticosMedicos_est_ID_Gral_tbEstudiantes_est_ID FOREIGN KEY(est_ID) REFERENCES Gral.tbEstudiantes(est_ID),
	CONSTRAINT FK_Med_tbDiagnosticosMedicos_UsuarioCreacion_Acce_tbUsuarios_usu_ID FOREIGN KEY(usu_UsuarioCreacion) REFERENCES Acce.tbUsuarios(usu_ID),
    CONSTRAINT FK_Med_tbDiagnosticosMedicos_UsuarioModificacion_Acce_tbUsuarios_usu_ID FOREIGN KEY(usu_UsuarioModificacion) REFERENCES Acce.tbUsuarios(usu_ID),
    CONSTRAINT FK_Med_tbDiagnosticosMedicos_UsuarioEliminacion_Acce_tbUsuarios_usu_ID FOREIGN KEY(usu_UsuarioEliminacion) REFERENCES Acce.tbUsuarios(usu_ID)
);
----------------------------------------Psi--------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------
CREATE TABLE Psi.tbSolicitudApoyo
(
    sol_ID INT IDENTITY (1,1),
    est_ID INT,
    sol_MotivoConsulta NVARCHAR (200) NOT NULL,
    sol_MalestarEmocional INT CHECK (sol_MalestarEmocional BETWEEN 1 AND 5),
    sol_Asistencia BIT DEFAULT 0,
    sol_HorarioPref VARCHAR(10),
	sol_Cancelacion BIT DEFAULT 0,
	sol_FechaCancelacion DATETIME NULL,
	
	sol_FechaCreacion			    DATETIME NOT NULL,
	sol_FechaModificacion		    DATETIME DEFAULT NULL,
	sol_FechaEliminacion			DATETIME DEFAULT NULL,
	sol_Estado 				        BIT DEFAULT 1,
	sol_Asignada					BIT DEFAULT 0

    CONSTRAINT PK_Psi_tbSolicitudApoyo_sol_ID PRIMARY KEY(sol_ID),
    CONSTRAINT FK_Psi_tbSolicitudApoyo_est_ID_Gral_tbEstudiantes_est_ID FOREIGN KEY (est_ID) REFERENCES Gral.tbEstudiantes (est_ID)
);

--- Tabla de Asignación de Sesiones de Apoyo 
CREATE TABLE Psi.tbSolicitudApoyoAsignada
(
		spa_ID			INT IDENTITY (1,1),
		sol_ID			INT,
		per_ID			INT,
		spa_Cancel		BIT DEFAULT 0,

		usu_UsuarioCreacion      INT     NOT NULL,
		spa_FechaCreacion        DATETIME NOT NULL,
		usu_UsuarioModificacion  INT     NULL,
		spa_FechaModificacion    DATETIME NULL,
		usu_UsuarioEliminacion   INT     NULL,
		spa_FechaEliminacion     DATETIME NULL,
		spa_Estado               BIT DEFAULT 1,
	
	CONSTRAINT PK_Psi_tbSolicitudApoyoAsignada_spa_ID PRIMARY KEY (spa_ID),
	CONSTRAINT FK_Psi_tbSolicitudApoyoAsignada_sco_ID_Psi_tbSolicitudApoyo_sol_ID			FOREIGN KEY(sol_ID) REFERENCES Psi.tbSolicitudApoyo(sol_ID),
	CONSTRAINT FK_Psi_tbSolicitudApoyoAsignada_per_ID_Gral_tbPersonal_per_ID				FOREIGN KEY(per_ID) REFERENCES Gral.tbPersonal(per_ID),
	CONSTRAINT FK_Psi_tbSolicitudApoyoAsignada_UsuarioCreacion_Acce_tbUsuarios_usu_ID		FOREIGN KEY(usu_UsuarioCreacion) REFERENCES Acce.tbUsuarios(usu_ID),
    CONSTRAINT FK_Psi_tbSolicitudApoyoAsignada_UsuarioModificacion_Acce_tbUsuarios_usu_ID	FOREIGN KEY(usu_UsuarioModificacion) REFERENCES Acce.tbUsuarios(usu_ID),
    CONSTRAINT FK_Psi_tbSolicitudApoyoAsignada_UsuarioEliminacion_Acce_tbUsuarios_usu_ID	FOREIGN KEY(usu_UsuarioEliminacion) REFERENCES Acce.tbUsuarios(usu_ID)
);

CREATE TABLE Psi.tbPlanAccion
(
    pla_ID INT IDENTITY (1,1),
    pla_ResumenSesion NVARCHAR(200) NOT NULL,
    pla_Objetivo NVARCHAR(200) NOT NULL,
    pla_ActividadSug NVARCHAR(200) NOT NULL,
    pla_FechaSeguimiento DATE,
    pla_Observacion NVARCHAR(200) NOT NULL,
	
	usu_UsuarioCreacion				INT NOT NULL,
	pla_FechaCreacion			    DATETIME NOT NULL,
	usu_UsuarioModificacion 		INT DEFAULT NULL,
	pla_FechaModificacion		    DATETIME DEFAULT NULL,
	usu_UsuarioEliminacion			INT	DEFAULT NULL,
	pla_FechaEliminacion			DATETIME DEFAULT NULL,
	pla_Estado 				        BIT DEFAULT 1

    CONSTRAINT PK_Psi_tbPlanAccion_pla_ID PRIMARY KEY(pla_ID)
	CONSTRAINT FK_Psi_tbPlanAccion_UsuarioCreacion_Acce_tbUsuarios_usu_ID FOREIGN KEY(usu_UsuarioCreacion) REFERENCES Acce.tbUsuarios(usu_ID),
    CONSTRAINT FK_Psi_tbPlanAccion_UsuarioModificacion_Acce_tbUsuarios_usu_ID FOREIGN KEY(usu_UsuarioModificacion) REFERENCES Acce.tbUsuarios(usu_ID),
    CONSTRAINT FK_Psi_tbPlanAccion_UsuarioEliminacion_Acce_tbUsuarios_usu_ID FOREIGN KEY(usu_UsuarioEliminacion) REFERENCES Acce.tbUsuarios(usu_ID)
);

-- Tabla de Solicitudes por planes
CREATE TABLE Psi.tbSolicitudesXPlanes
(

	spl_ID	INT IDENTITY(1,1),
	sol_ID	INT,
	pla_ID	INT,
	
	usu_UsuarioCreacion				INT NOT NULL,
	spl_FechaCreacion			    DATETIME NOT NULL,
	usu_UsuarioModificacion 		INT DEFAULT NULL,
	spl_FechaModificacion		    DATETIME DEFAULT NULL,
	usu_UsuarioEliminacion			INT	DEFAULT NULL,
	spl_FechaEliminacion			DATETIME DEFAULT NULL,
	spl_Estado 				        BIT DEFAULT 1

	CONSTRAINT PK_Psi_SolicitudesXPlanes_spl_ID PRIMARY KEY(spl_ID),
	CONSTRAINT FK_Psi_SolicitudesXPlanes_sol_ID_Psi_tbSolicitudApoyo_sol_ID FOREIGN KEY(sol_ID) REFERENCES Psi.tbSolicitudApoyo(sol_ID),
	CONSTRAINT FK_Psi_SolicitudesXPlanes_pla_ID_Psi_tbPlanAccion_pla_ID	FOREIGN KEY (pla_ID) REFERENCES Psi.tbPlanAccion (pla_ID),
	CONSTRAINT FK_Psi_SolicitudesXPlanes_UsuarioCreacion_Acce_tbUsuarios_usu_ID FOREIGN KEY(usu_UsuarioCreacion) REFERENCES Acce.tbUsuarios(usu_ID),
    CONSTRAINT FK_Psi_SolicitudesXPlanes_UsuarioModificacion_Acce_tbUsuarios_usu_ID FOREIGN KEY(usu_UsuarioModificacion) REFERENCES Acce.tbUsuarios(usu_ID),
    CONSTRAINT FK_Psi_SolicitudesXPlanes_UsuarioEliminacion_Acce_tbUsuarios_usu_ID FOREIGN KEY(usu_UsuarioEliminacion) REFERENCES Acce.tbUsuarios(usu_ID)

);