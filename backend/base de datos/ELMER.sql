---Mi espacio de trabajo
-----------------------------------------Med-----------------------------------------------------------------------------------------------------------------------

-- Tabla de registros de llegada--

CREATE TABLE Med.tbRegistro
(
    reg_ID INT IDENTITY (1,1),
    est_ID INT       NOT NULL,
    reg_FechaHora DATE  NOT NULL,

    CONSTRAINT PK_Med_tbRegistro_reg_ID PRIMARY KEY (reg_ID)
);  

CREATE TABLE Med.tbDiagnosticos
(
    dia_ID INT IDENTITY (1,1),
    reg_ID INT,
    dia_DiagnosticoPrin NVARCHAR (200) NULL,
    dia_EstadoConsulta BIT NOT NULL,

    CONSTRAINT PK_Med_tbDiagnosticos_dia_ID PRIMARY KEY (dia_ID),
    CONSTRAINT FK_Med_tbDiagnosticos_reg_ID_Med_tbRegistro_reg_ID FOREIGN KEY (reg_ID) REFERENCES Med.tbRegistro (reg_ID)
);

----------------------------------------Psi-----------------------------------------------------------------------------------------------------------------------
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
    sol_ID INT,
    pla_ResumenSesion NVARCHAR(200) NOT NULL,
    pla_Objetivo NVARCHAR(200) NOT NULL,
    pla_ActividadSug NVARCHAR(200) NOT NULL,
    pla_FechaSeguimiento DATE,
    pla_Observacion NVARCHAR(200) NOT NULL,

    CONSTRAINT PK_Psi_tbPlanAccion_pla_ID PRIMARY KEY(pla_ID),
	CONSTRAINT FK_Psi_tbPlanAccion_ses_ID_Psi_tbSolicitudApoyo_sol_ID	FOREIGN KEY (sol_ID) REFERENCES Psi.tbSolicitudApoyo(sol_ID)
);
