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