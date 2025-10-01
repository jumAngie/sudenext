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
	est_ID				INT,
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

	--CONSTRAINT FK_Acce_tbUsuarios_est_ID_Gral_tbEstudiantes_est_ID FOREIGN KEY (est_ID) REFERENCES Gral.tbEstudiantes (est_ID),
	--CONSTRAINT FK_Acce_tbUsuarios_per_ID_Gral_tbPersonal_per_ID		FOREIGN KEY(per_ID) REFERENCES Gral.tbPersonal(per_ID),
	--CONSTRAINT FK_Acce_tbUsuarios_rol_ID_Acce_tbRoles_rol_ID		FOREIGN KEY(rol_ID)	REFERENCES Acce.tbRoles(rol_ID)
);

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
	CONSTRAINT FK_Acce_tbPantallas_usu_UsuarioEliminacion_Acce_tbUsuarios_usu_ID FOREIGN KEY(usu_UsuarioEliminacion) REFERENCES Acce.tbUsuarios(usu_ID),
);
-- Tabla de Roles
CREATE TABLE Acce.tbRoles
(
	rol_ID			INT IDENTITY(1,1),
	rol_Descripcion	NVARCHAR(30)

	CONSTRAINT PK_Acce_tbRoles_rol_ID			PRIMARY KEY (rol_ID),
	CONSTRAINT UQ_Acce_tbRoles_rol_Descripcion	UNIQUE (rol_Descripcion)
);

-- Tabla de Roles por Pantallas
CREATE TABLE Acce.tbRolesXPantallas
(
		rop_ID		INT IDENTITY(1,1),
		rol_ID		INT,
		pan_ID		INT

		CONSTRAINT PK_Acce_tbRolesxPantallas_rop_ID PRIMARY KEY(rop_ID),
		CONSTRAINT FK_Acce_tbRolesxPantallas_rol_ID_Acce_tbRoles_rol_ID FOREIGN KEY (rol_ID) REFERENCES Acce.tbRoles (rol_ID),
		CONSTRAINT FK_Acce_tbRolesxPantallas_pan_ID_Acce_tbPantallas_pan_ID FOREIGN KEY (pan_ID) REFERENCES Acce.tbPantallas (pan_ID)
);
---------------------------------------------------  GRAL  -----------------------------------------------------
----------------------------------------------------------------------------------------------------------------
-- Tabla de Areas
CREATE TABLE Gral.tbAreas
(	
	are_ID			INT IDENTITY(1,1),
	are_Nombre		VARCHAR(25)			NOT NULL

	CONSTRAINT PK_Gral_tbAreas_are_ID PRIMARY KEY(are_ID),
	CONSTRAINT UQ_Gral_tbAreas_are_Nombre UNIQUE (are_Nombre)
);


-- Tabla de Estudiantes
CREATE TABLE Gral.tbEstudiantes
(
	est_ID				INT IDENTITY(1,1),
	est_NumeroCuenta	VARCHAR(11)		NOT NULL,
	est_NombreCompleto	NVARCHAR(200)	NOT NULL,
	est_Correo			NVARCHAR(50)	NOT NULL,
	est_Celular			VARCHAR(20)		NOT NULL,
	est_Carrera			NVARCHAR(50)	NOT NULL,
	est_Estado			BIT				NOT NULL
	
	CONSTRAINT PK_Gral_tbEstudiantes_est_ID  PRIMARY KEY (est_ID),
	CONSTRAINT UQ_Gral_tbEstudiantes_est_NumeroCuenta UNIQUE (est_NumeroCuenta)
);

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

		CONSTRAINT PK_Gral_tbPersonal_per_ID			    PRIMARY KEY	(per_ID),
		CONSTRAINT CK_Gral_tbPersonal_per_EstadoCivil		CHECK		(per_EstadoCivil IN('SL','CS', 'DV', 'VD', 'UL', 'SP')),
		CONSTRAINT CK_Gral_tbPersonal_per_Sexo				CHECK		(per_Sexo IN('F', 'M')),
		CONSTRAINT UQ_Gral_tbPersonal_per_Telefono			UNIQUE		(per_Telefono),
		CONSTRAINT UQ_Gral_tbPersonal_per_Correo			UNIQUE		(per_Correo),
		CONSTRAINT FK_Gral_tbPersonal_are_ID_Gral_tbAreas_are_ID		FOREIGN KEY (are_ID) REFERENCES Gral.tbAreas(are_ID)
);

---------------------------------------------------  ACAD  -----------------------------------------------------
----------------------------------------------------------------------------------------------------------------
-- Tabla de tipos de consultas academicas
CREATE TABLE Acad.tbTipoConsulta
(
		tic_ID	INT IDENTITY(1,1),
		tic_Descripcion	NVARCHAR(80)	NOT NULL

		CONSTRAINT PK_Acad_tbTipoConsulta_tic_ID	PRIMARY KEY (tic_ID)
);

--- Tabla de Consultas Academicas
CREATE TABLE Acad.tbConsultasAcademicas
(
		coa_ID				INT IDENTITY(1,1),
		est_ID				INT,
		tic_ID				INT,
		coa_Descripcion		NVARCHAR(MAX)	NOT NULL,
		coa_Recomendacion	NVARCHAR(255),
		coa_Seguimiento		BIT DEFAULT 0	

		CONSTRAINT PK_Acad_tbConsultasAcademicas_coa_ID	PRIMARY KEY(coa_ID),
		CONSTRAINT FK_Acad_tbConsultasAcademicas_est_ID_Gral_tbEstudiantes_est_ID	FOREIGN KEY(est_ID) REFERENCES Gral.tbEstudiantes(est_ID),
		CONSTRAINT FK_Acad_tbConsultasAcademicas_tic_ID_Acad_tbTipoConsulta_tic_ID	FOREIGN KEY(tic_ID) REFERENCES Acad.tbTipoConsulta(tic_ID)
);
---------------------------------------------------  ODON  ----------------------------------------------------
----------------------------------------------------------------------------------------------------------------
--- Tabla de Solicitudes de Cita Odontologica
CREATE TABLE Odon.tbSolicitudCitaOdon
(
	sco_ID			INT IDENTITY(1,1),
	est_ID			INT,
	sco_FechaP		DATE				NOT NULL,
	sco_Hora		TIME				NOT NULL,
	sco_Motivo		NVARCHAR(255)		NOT NULL,
	sco_Prioridad	CHAR(1) DEFAULT 'B' NOT NULL

	CONSTRAINT PK_Odon_tbSolicitudCitaOdon_sco_ID	PRIMARY KEY(sco_ID),
	CONSTRAINT FK_Odon_tbSolicitudCitaOdon_est_ID_Gral_tbEstudiantes_est_ID FOREIGN KEY(est_ID) REFERENCES Gral.tbEstudiantes(est_ID),
	CONSTRAINT CK_Odon_tbSolicitudCitaOdon_sco_Prioridad CHECK(sco_Prioridad IN('B','M','A'))
);

--- Tabla de Tratamientos disponibles
CREATE TABLE Odon.tbTratamientos
(
	tra_ID	INT IDENTITY(1,1),
	tra_Descripcion	NVARCHAR(100)	NOT NULL

	CONSTRAINT PK_Odon_tbTratamientos_tra_ID	PRIMARY KEY(tra_ID)
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
	trd_Observaciones	NVARCHAR(255)

	CONSTRAINT PK_Odon_tbTratamientoDiagnosticado_trd_ID PRIMARY KEY(trd_ID),
	CONSTRAINT FK_Odon_tbTratamientoDiagnosticado_est_ID_Gral_tbEstudiantes_est_ID FOREIGN KEY(est_ID) REFERENCES Gral.tbEstudiantes(est_ID),
	CONSTRAINT FK_odon_tbTratamientoDiagnosticado_tra_ID_Odon_tbTratamientos_tra_ID	FOREIGN KEY(tra_ID) REFERENCES Odon.tbTratamientos(tra_ID)
);
-----------------------------------------Med---------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------
CREATE TABLE Med.tbDiagnosticosMedicos
(
    dia_ID INT IDENTITY (1,1),
	est_ID	INT,
    reg_ID INT,
    dia_DiagnosticoPrin NVARCHAR (200) NULL,
    dia_EstadoConsulta BIT NOT NULL,

    CONSTRAINT PK_Med_tbDiagnosticosMedicos_dia_ID PRIMARY KEY (dia_ID),
	CONSTRAINT FK_Med_tbDiagnosticosMedicos_est_ID_Gral_tbEstudiantes_est_ID FOREIGN KEY(est_ID) REFERENCES Gral.tbEstudiantes(est_ID)
);
----------------------------------------Psi--------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------
CREATE TABLE Psi.tbSolicitudApoyo
(
    sol_ID INT IDENTITY (1,1),
    est_ID INT,
    sol_ResumenSesion NVARCHAR (200) NOT NULL,
    sol_MotivoConsulta NVARCHAR (200) NOT NULL,
    sol_MalestarEmocional INT CHECK (sol_MalestarEmocional BETWEEN 1 AND 5), --Este que seria--
    sol_Asistencia BIT DEFAULT 0,
    sol_HorarioPref TIME,

    CONSTRAINT PK_Psi_tbSolicitudApoyo_sol_ID PRIMARY KEY(sol_ID),
    CONSTRAINT FK_Psi_tbSolicitudApoyo_est_ID_Gral_tbEstudiantes_est_ID FOREIGN KEY (est_ID) REFERENCES Gral.tbEstudiantes (est_ID)
);

CREATE TABLE Psi.tbPlanAccion
(
    pla_ID INT IDENTITY (1,1),
    pla_ResumenSesion NVARCHAR(200) NOT NULL,
    pla_Objetivo NVARCHAR(200) NOT NULL,
    pla_ActividadSug NVARCHAR(200) NOT NULL,
    pla_FechaSeguimiento DATE,
    pla_Observacion NVARCHAR(200) NOT NULL,

    CONSTRAINT PK_Psi_tbPlanAccion_pla_ID PRIMARY KEY(pla_ID)
);

-- Tabla de Solicitudes por planes
CREATE TABLE Psi.SolicitudesXPlanes
(

	spl_ID	INT IDENTITY(1,1),
	sol_ID	INT,
	pla_ID	INT

	CONSTRAINT PK_Psi_SolicitudesXPlanes_spl_ID PRIMARY KEY(spl_ID),
	CONSTRAINT FK_Psi_SolicitudesXPlanes_sol_ID_Psi_tbSolicitudApoyo_sol_ID FOREIGN KEY(sol_ID) REFERENCES Psi.tbSolicitudApoyo(sol_ID),
	CONSTRAINT FK_Psi_SolicitudesXPlanes_pla_ID_Psi_tbPlanAccion_pla_ID	FOREIGN KEY (pla_ID) REFERENCES Psi.tbPlanAccion (pla_ID)

);