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

-- Tabla de Roles
CREATE TABLE Acce.tbRoles
(
	rol_ID			INT IDENTITY(1,1),
	rol_Descripcion	NVARCHAR(30)

	CONSTRAINT PK_Acce_tbRoles_rol_ID			PRIMARY KEY (rol_ID),
	CONSTRAINT UQ_Acce_tbRoles_rol_Descripcion	UNIQUE (rol_Descripcion)
);

-- Tabla de Usuarios
CREATE TABLE Acce.tbUsuarios
(
	usu_ID				INT IDENTITY(1,1),
	est_ID				INT,
	usu_NumeroCuenta	VARCHAR(11),
	usu_Contrasena		NVARCHAR(255),

);