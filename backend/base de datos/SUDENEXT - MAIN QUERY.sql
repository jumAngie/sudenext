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

---------------------------------------------------  GRAL  -----------------------------------------------------
----------------------------------------------------------------------------------------------------------------
--- Tabla de Ciudades
CREATE TABLE Gral.tbCiudades
(
	ciu_ID		INT IDENTITY(1,1),
	ciu_Nombre	NVARCHAR(100)		NOT NULL

	CONSTRAINT PK_Gral_tbCiudades_ciud_ID	PRIMARY KEY(ciu_ID)
);

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
		ciu_ID				INT,
		per_Correo			NVARCHAR(80)	NOT NULL,
		are_ID				INT,

		CONSTRAINT PK_Gral_tbPersonal_per_ID			    PRIMARY KEY	(per_ID),
		CONSTRAINT CK_Gral_tbPersonal_per_EstadoCivil		CHECK		(per_EstadoCivil IN('SL','CS', 'DV', 'VD', 'UL', 'SP')),
		CONSTRAINT CK_Gral_tbPersonal_per_Sexo				CHECK		(per_Sexo IN('F', 'M')),
		CONSTRAINT UQ_Gral_tbPersonal_per_Telefono			UNIQUE		(per_Telefono),
		CONSTRAINT UQ_Gral_tbPersonal_per_Correo			UNIQUE		(per_Correo),
		CONSTRAINT FK_Gral_tbPersonal_ciu_ID_Gral_tbCiudades_ciu_ID		FOREIGN KEY (ciu_ID) REFERENCES Gral.tbCiudades (ciu_ID),
		CONSTRAINT FK_Gral_tbPersonal_are_ID_Gral_tbAreas_are_ID		FOREIGN KEY (are_ID) REFERENCES Gral.tbAreas(are_ID)
);
---------------------------------------------------  ACCE  -----------------------------------------------------
----------------------------------------------------------------------------------------------------------------
CREATE TABLE Acce.tbPantallas
(
	pan_ID				INT IDENTITY(1,1),
	pan_Nombre			VARCHAR(25),
	pan_URL				NVARCHAR(255),
	pan_Identificador	VARCHAR(5),
	pan_Icono			VARCHAR(15),
	are_ID				INT

	CONSTRAINT PK_Acce_tbPantallas_pan_ID	PRIMARY KEY (pan_ID),
	CONSTRAINT FK_Acce_tbPantallas_are_ID_Gral_tbAreas_are_ID	FOREIGN KEY (are_ID) REFERENCES Gral.tbAreas (are_ID)
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

-- Tabla de Usuarios
CREATE TABLE Acce.tbUsuarios
(
	usu_ID				INT IDENTITY(1,1),
	usu_Usuario			NVARCHAR(80)		NOT NULL,
	usu_Contrasena		NVARCHAR(255)		NOT NULL,
	est_ID				INT,
	per_ID				INT,
	rol_ID				INT

	CONSTRAINT PK_Acce_tbUsuarios_usu_ID	PRIMARY KEY (usu_ID),
	CONSTRAINT FK_Acce_tbUsuarios_est_ID_Gral_tbEstudiantes_est_ID FOREIGN KEY (est_ID) REFERENCES Gral.tbEstudiantes (est_ID),
	CONSTRAINT FK_Acce_tbUsuarios_per_ID_Gral_tbPersonal_per_ID		FOREIGN KEY(per_ID) REFERENCES Gral.tbPersonal(per_ID),
	CONSTRAINT FK_Acce_tbUsuarios_rol_ID_Acce_tbRoles_rol_ID		FOREIGN KEY(rol_ID)	REFERENCES Acce.tbRoles(rol_ID)
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
-- Tabla de tipos de procedimientos odontologicos
CREATE TABLE Odon.tbProcedimientos(
	pro_ID		INT IDENTITY(1,1),
	pro_Descripcion	NVARCHAR(100)	NOT NULL

	CONSTRAINT PK_Odon_tbProcedimientos_pro_ID PRIMARY KEY(pro_ID)
);

-- Tabla de materiales
CREATE TABLE Odon.tbMateriales(
	mat_ID		INT IDENTITY(1,1),
	mat_Descripcion	NVARCHAR(100)	NOT NULL

	CONSTRAINT PK_Odon_tbMateriales_mat_ID	PRIMARY KEY(mat_ID)
);

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
CREATE TABLE Odon.tbTratamientoDiagnosticado
(
	trd_ID				INT IDENTITY(1,1),
	sco_ID				INT,
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
	CONSTRAINT FK_Odon_tbTratamientoDiagnosticado_sco_ID_Odon_tbSolicitudCitaOdon_sco_ID FOREIGN KEY(sco_ID) REFERENCES Odon.tbSolicitudCitaOdon(sco_ID),
	CONSTRAINT FK_odon_tbTratamientoDiagnosticado_tra_ID_Odon_tbTratamientos_tra_ID	FOREIGN KEY(tra_ID) REFERENCES Odon.tbTratamientos(tra_ID)
);

--- Tabla de Procedimientos usados en un Tratamiento
CREATE TABLE Odon.tbProcedimientosXTratamiento
(
	prt_ID	INT IDENTITY(1,1),
	trd_ID	INT,
	pro_ID	INT
	
	CONSTRAINT PK_Odon_tbProcedimientosXTratamiento_prt_ID	PRIMARY KEY(prt_ID),
	CONSTRAINT FK_Odon_tbProcedimientosXTratamiento_trd_ID_Odon_tbTratamientoDiagnosticado_trd_ID FOREIGN KEY(trd_ID) REFERENCES Odon.tbTratamientoDiagnosticado(trd_ID),
	CONSTRAINT FK_Odon_tbProcedimientosXTratamiento_pro_ID_Odon_tbProcedimientos_pro_ID	FOREIGN KEY(pro_ID)	REFERENCES Odon.tbProcedimientos(pro_ID)
);

--- Tabla de materiales usados en un Tratamiento
CREATE TABLE Odon.tbMaterialesXTratamiento
(
	mtr_ID	INT IDENTITY(1,1),
	trd_ID	INT,
	mat_ID	INT
	
	CONSTRAINT PK_Odon_tbMaterialesXTratamiento_mtr_ID	PRIMARY KEY(mtr_ID),
	CONSTRAINT FK_Odon_tbMaterialesXTratamiento_trd_ID_Odon_tbTratamientoDiagnosticado_trd_ID FOREIGN KEY(trd_ID) REFERENCES Odon.tbTratamientoDiagnosticado(trd_ID),
	CONSTRAINT FK_Odon_tbMaterialesXTratamiento_mat_ID_Odon_tbMateriales_mat_ID	FOREIGN KEY(mat_ID)	REFERENCES Odon.tbMateriales(mat_ID)
);