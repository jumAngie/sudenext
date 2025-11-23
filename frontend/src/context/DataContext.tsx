import React, { createContext, useContext, useState, useEffect } from "react";
import {
  SupportSession,
  ActionPlan,
  DentalAppointment,
  MedicalCheckIn,
  AcademicConsultation,
  DentalTreatment,
  Area,
  Personnel,
  Role,
  SystemUser,
  ConsultationType,
  TreatmentType,
  PersonalSinUsuario
} from "../types";

import {
  fetchAreas,
  createAreaAPI,
  updateAreaAPI,
  deleteAreaAPI,
} from "/src/services/areaService.ts";

import {
  fetchPersonalSinUsuario,
  fetchPersonal,
  createPersonalAPI,
  updatePersonalAPI,
  deletePersonalAPI
} from "/src/services/personalService.ts";

import {
  fetchTipoTratamientos,
  createTipoTratamientoAPI,
  updateTipoTratamientoAPI,
  deleteTipoTratamientoAPI
} from "/src/services/tipoTratamientoService.ts";

import {
  fetchTipoConsultas,
  createTipoConsultaAPI,
  updateTipoConsultaAPI,
  deleteTipoConsultaAPI
} from "/src/services/tipoConsultaService.ts";

import {
  fetchUsuarios,
  createUsuarioAPI,
  updateUsuarioAPI,
  deleteUsuarioAPI
} from "/src/services/usuarioService.ts";

import {
  fetchRoles,
  createRolesAPI,
  updateRolesAPI,
  deleteRolesAPI
} from "/src/services/rolService.ts";

import {
  fetchSolicitudApoyo,
  createSolicitudApoyoAPI,
  updateSolicitudApoyoAPI,
  deleteSolicitudApoyoAPI,
} from "/src/services/solicitudApoyoService.ts";

interface DataContextType {
  // Support Sessions (API real)
  supportSessions: SupportSession[];
  //fetchSupportSessions: () => Promise<void>;
  addSupportSession: (payload: {
    est_ID: number;
    sol_MotivoConsulta: string;
    sol_ResumenSesion: string;
    sol_MalestarEmocional: number;
    sol_HorarioPref: string;
    sol_Asistencia: boolean;
    sol_Estado: boolean;
    sol_FechaCreacion: string;
  }) => Promise<string>;

  updateSupportSession: (payload: {
    sol_ID: number;
    sol_MotivoConsulta: string;
    sol_ResumenSesion: string;
    sol_MalestarEmocional: number;
    sol_HorarioPref: string;
    sol_FechaModificacion: string;
  }) => Promise<string>;

  cancelSupportSession: (payload: {
    sol_ID: number;
    sol_Cancelacion: boolean;
    sol_FechaCancelacion: string;
  }) => Promise<string>;


  // Action Plans
  actionPlans: ActionPlan[];
  addActionPlan: (plan: Omit<ActionPlan, "id" | "createdAt">) => void;

  // Dental Appointments
  dentalAppointments: DentalAppointment[];
  addDentalAppointment: (
    appointment: Omit<DentalAppointment, "id" | "createdAt">
  ) => void;
  updateDentalAppointment: (
    id: string,
    updates: Partial<DentalAppointment>
  ) => void;

  // Dental Treatments
  dentalTreatments: DentalTreatment[];
  addDentalTreatment: (
    treatment: Omit<DentalTreatment, "id" | "createdAt">
  ) => void;
  updateDentalTreatment: (
    id: string,
    updates: Partial<DentalTreatment>
  ) => void;

  // Medical Check-ins
  medicalCheckIns: MedicalCheckIn[];
  addMedicalCheckIn: (
    checkIn: Omit<MedicalCheckIn, "id" | "createdAt">
  ) => void;
  updateMedicalCheckIn: (id: string, updates: Partial<MedicalCheckIn>) => void;

  // Academic Consultations
  academicConsultations: AcademicConsultation[];
  addAcademicConsultation: (
    consultation: Omit<AcademicConsultation, "id" | "createdAt">
  ) => void;
  updateAcademicConsultation: (
    id: string,
    updates: Partial<AcademicConsultation>
  ) => void;

  // Areas
  areas: Area[];
  addArea: (payload: {
    are_Nombre: string;
    usu_UsuarioCreacion: number;
    are_FechaCreacion: string;
  }) => Promise<void>;

  updateArea: (
    id: number,
    payload: {
      are_ID: number;
      are_Nombre: string;
      usu_UsuarioModificacion: number;
      are_FechaModificacion: string;
    }
  ) => Promise<void>;

  deleteArea: (
    id: number,
    payload: {
      are_ID: number;
      are_Nombre: string,
      usu_UsuarioEliminacion: number;
      are_FechaEliminacion: string;
    }
  ) => Promise<void>;

  // Roles
  roles: Role[];
  addRole: (payload: {
    rol_Descripcion: string;
    usu_UsuarioCreacion: number;
    rol_FechaCreacion: string;
  }) => Promise<void>;

  updateRole: (
    id: number,
    payload: {
      rol_ID: number;
      rol_Descripcion: string;
      usu_UsuarioModificacion: number;
      rol_FechaModificacion: string;
    }
  ) => Promise<void>;

  deleteRole: (
    id: number,
    payload: {
      rol_ID: number;
      rol_Descripcion: string,
      usu_UsuarioEliminacion: number;
      rol_FechaEliminacion: string;
    }
  ) => Promise<void>;

  // Tipo Tratamiento
  treatmentTypes: TreatmentType[];
  addTreatmentType: (payload: {
    tra_Descripcion: string;
    usu_UsuarioCreacion: number;
    tra_FechaCreacion: string;
  }) => Promise<void>;

  updateTreatmentType: (
    id: number,
    payload: {
      tra_ID: number;
      tra_Descripcion: string;
      usu_UsuarioModificacion: number;
      tra_FechaModificacion: string;
    }
  ) => Promise<void>;

  deleteTreatmentType: (
    id: number,
    payload: {
      tra_ID: number;
      tra_Descripcion: string,
      usu_UsuarioEliminacion: number;
      tra_FechaEliminacion: string;
    }
  ) => Promise<void>;

  // Consultation Types
  consultationTypes: ConsultationType[];
  addConsultationType: (payload: {
    tic_Descripcion: string;
    usu_UsuarioCreacion: number;
    tic_FechaCreacion: string;
  }) => Promise<void>;

  updateConsultationType: (
    id: number,
    payload: {
      tic_ID: number;
      tic_Descripcion: string;
      usu_UsuarioModificacion: number;
      tic_FechaModificacion: string;
    }
  ) => Promise<void>;

  deleteConsultationType: (
    id: number,
    payload: {
      tic_ID: number;
      tic_Descripcion: string,
      usu_UsuarioEliminacion: number;
      tic_FechaEliminacion: string;
    }
  ) => Promise<void>;

  // Usuarios
  systemUsers: SystemUser[];
  addSystemUser: (payload: {
    usu_Usuario: string;
    usu_Contrasena: string,
    per_ID: number,
    rol_ID: number,
    usu_UsuarioCreacion: number;
    usu_FechaCreacion: string;
  }) => Promise<void>;

  updateSystemUser: (
    id: number,
    payload: {
      usu_ID: number;
      usu_Usuario: string;
      usu_Contrasena: string,
      per_ID: number,
      rol_ID: number,
      usu_UsuarioModificacion: number;
      usu_FechaModificacion: string;
    }
  ) => Promise<void>;

  deleteSystemUser: (
    id: number,
    payload: {
      usu_ID: number;
      usu_Usuario: string;
      usu_Contrasena: string,
      usu_UsuarioEliminacion: number;
      usu_FechaEliminacion: string;
    }
  ) => Promise<void>;

  // Personnel
  personalSinUsuario: PersonalSinUsuario[];
  personnel: Personnel[];
  addPersonnel: (payload: {
    per_Nombres: string;
    per_Apellidos: string,
    per_EstadoCivil: string,
    per_Sexo: string,
    per_FechaNac: string,
    per_Telefono: string,
    per_Direccion: string,
    per_Correo: string,
    are_ID: number,

    usu_UsuarioCreacion: number;
    per_FechaCreacion: string;
  }) => Promise<void>;

  updatePersonnel: (
    id: number,
    payload: {
      per_ID: number;
      per_Nombres: string;
      per_Apellidos: string,
      per_EstadoCivil: string,
      per_Sexo: string,
      per_FechaNac: string,
      per_Telefono: string,
      per_Direccion: string,
      per_Correo: string,
      are_ID: number,

      usu_UsuarioModificacion: number;
      per_FechaModificacion: string;
    }
  ) => Promise<void>;

  deletePersonnel: (
    id: number,
    payload: {
      per_ID: number;
      usu_UsuarioEliminacion: number;
      per_FechaEliminacion: string;
    }
  ) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper function to get dates for the current month
const getCurrentMonthDates = () => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  return {
    // Tomorrow
    tomorrow: new Date(
      currentYear,
      currentMonth,
      today.getDate() + 1
    ).toISOString(),
    // Day after tomorrow
    dayAfter: new Date(
      currentYear,
      currentMonth,
      today.getDate() + 2
    ).toISOString(),
    // Next week
    nextWeek: new Date(
      currentYear,
      currentMonth,
      today.getDate() + 7
    ).toISOString(),
    // In 10 days
    inTenDays: new Date(
      currentYear,
      currentMonth,
      today.getDate() + 10
    ).toISOString(),
    // In 15 days
    inFifteenDays: new Date(
      currentYear,
      currentMonth,
      today.getDate() + 15
    ).toISOString(),
    // In 20 days
    inTwentyDays: new Date(
      currentYear,
      currentMonth,
      today.getDate() + 20
    ).toISOString(),
  };
};

// Mock initial data
const dates = getCurrentMonthDates();

const initialDentalAppointments: DentalAppointment[] = [
  {
    id: "dental-1",
    studentId: "student-3",
    studentName: "Elmer Isai Alvarez Carbajal",
    accountNumber: "20210001123",
    preferredDate: "2024-01-25",
    preferredTime: "10:00",
    reason: "Dolor en muela del juicio",
    priority: "alta",
    status: "pendiente",
    createdAt: "2024-01-16T11:00:00Z",
  },
  {
    id: "dental-2",
    studentId: "student-4",
    studentName: "Juan David Molina Sagastume",
    accountNumber: "20240128910",
    preferredDate: "2024-01-28",
    preferredTime: "14:00",
    reason: "Limpieza dental de rutina",
    priority: "baja",
    status: "confirmada",
    assignedDentistId: "staff-2",
    assignedDentistName: "Sherlyn Nicole Monje",
    createdAt: "2024-01-18T09:30:00Z",
  },
  {
    id: "dental-3",
    studentId: "student-9",
    studentName: "Mario Deniel Hernandez",
    accountNumber: "20222000200",
    preferredDate: "2024-02-02",
    preferredTime: "09:00",
    reason: "Revisión de ortodoncia",
    priority: "media",
    status: "pendiente",
    createdAt: "2024-01-22T10:15:00Z",
  },
];

const initialMedicalCheckIns: MedicalCheckIn[] = [
  {
    id: "medical-1",
    studentId: "student-1",
    studentName: "Angie Yahaira Campos Arias",
    accountNumber: "20222000215",
    symptoms: ["Dolor de cabeza", "Fatiga"],
    temperature: 36.8,
    bloodPressure: "120/80",
    observations:
      "Dolor de cabeza por estrés académico. Se recomienda descanso.",
    attended: true,
    createdAt: "2024-01-16T08:30:00Z",
  },
  {
    id: "medical-2",
    studentId: "student-2",
    studentName: "Cindy Nicole Reyes Arevalo",
    accountNumber: "20222000224",
    symptoms: [],
    temperature: 36.5,
    bloodPressure: "118/75",
    observations: "Check-up de rutina. Valores normales.",
    attended: true,
    createdAt: "2024-01-17T10:15:00Z",
  },
  {
    id: "medical-3",
    studentId: "student-6",
    studentName: "Nathaly Valeria Durán Castillo",
    accountNumber: "20222000123",
    symptoms: ["Tos", "Dolor de garganta"],
    temperature: 37.2,
    bloodPressure: "115/70",
    observations: "Síntomas de resfriado común. Se prescribe reposo.",
    attended: true,
    createdAt: "2024-01-18T09:45:00Z",
  },
  {
    id: "medical-4",
    studentId: "student-8",
    studentName: "Jasser Evelio George Martinez",
    accountNumber: "20222000187",
    symptoms: ["Dolor abdominal"],
    temperature: 37.8,
    bloodPressure: "125/85",
    observations: "Dolor abdominal posiblemente relacionado con estrés.",
    attended: false,
    createdAt: "2024-01-19T11:20:00Z",
  },
];

const initialAcademicConsultations: AcademicConsultation[] = [
  {
    id: "academic-1",
    studentId: "student-5",
    studentName: "Luis Mario Aguilera Valle",
    accountNumber: "20222000120",
    consultationType: "Orientación Académica",
    description: "Dudas sobre especialización en enfermería geriátrica",
    advisorId: "staff-4",
    advisorName: "Denis Roberto García",
    resolution:
      "Se recomienda tomar cursos electivos en geriatría antes de decidir la especialización",
    followUpRequired: true,
    followUpDate: "2024-02-15",
    status: "completada",
    createdAt: "2024-01-15T11:00:00Z",
    completedAt: "2024-01-15T11:45:00Z",
  },
  {
    id: "academic-2",
    studentId: "student-7",
    studentName: "Gerson David Franco Lobo",
    accountNumber: "20222000125",
    consultationType: "Dificultades Académicas",
    description:
      "Bajo rendimiento en filosofía medieval y necesidad de apoyo adicional",
    advisorId: "staff-4",
    advisorName: "Denis Roberto García",
    followUpRequired: true,
    status: "pendiente",
    createdAt: "2024-01-18T14:30:00Z",
  },
  {
    id: "academic-3",
    studentId: "student-10",
    studentName: "Miriam Alicia Rojas",
    accountNumber: "20222001203",
    consultationType: "Cambio de Carrera",
    description: "Interés en cambiar de Pedagogía a Psicología Educativa",
    advisorId: "staff-4",
    advisorName: "Denis Roberto García",
    resolution:
      "Se explicaron los procedimientos para cambio de carrera y requisitos académicos",
    followUpRequired: false,
    status: "completada",
    createdAt: "2024-01-20T10:15:00Z",
    completedAt: "2024-01-20T11:00:00Z",
  },
];

const initialDentalTreatments: DentalTreatment[] = [
  {
    id: "treatment-1",
    appointmentId: "dental-2",
    studentId: "student-4",
    studentName: "Juan David Molina Sagastume",
    accountNumber: "20240128910",
    dentistId: "staff-2",
    dentistName: "Sherlyn Nicole Monje",
    treatmentType: "Limpieza Dental",
    treatmentDescription: "Profilaxis dental de rutina",
    diagnosis: "Gingivitis leve, acumulación de placa bacteriana",
    proceduresPerformed: [
      "Limpieza supragingival",
      "Pulido dental",
      "Aplicación de flúor",
    ],
    materialsUsed: ["Pasta profiláctica", "Flúor gel"],
    duration: 45,
    cost: 150,
    requiresFollowUp: true,
    followUpDate: "2024-07-28",
    followUpInstructions:
      "Cepillado dental 3 veces al día, uso de hilo dental diario, enjuague bucal",
    notes: "Paciente cooperativo. Se explicaron técnicas de higiene oral.",
    status: "completado",
    createdAt: "2024-01-28T14:00:00Z",
    completedAt: "2024-01-28T14:45:00Z",
  },
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  // FUNCIONALES
  const [areas, setAreas] = useState<Area[]>([]);
  const [treatmentTypes, setTreatmentTypes] = useState<TreatmentType[]>([]);
  const [consultationTypes, setConsultationTypes] = useState<ConsultationType[]>([]);
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([]);
  const [personalSinUsuario, setPersonalSinUsuario] = useState<PersonalSinUsuario[]>([]);
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [supportSessions, setSupportSessions] = useState<SupportSession[]>([]);

  // NO FUNCIONALES

  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([]);
  const [dentalAppointments, setDentalAppointments] = useState<
    DentalAppointment[]
  >(initialDentalAppointments);
  const [dentalTreatments, setDentalTreatments] = useState<DentalTreatment[]>(
    initialDentalTreatments
  );
  const [medicalCheckIns, setMedicalCheckIns] = useState<MedicalCheckIn[]>(
    initialMedicalCheckIns
  );
  const [academicConsultations, setAcademicConsultations] = useState<
    AcademicConsultation[]
  >(initialAcademicConsultations);

  // Generate unique ID
  const generateId = (prefix: string) =>
    `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;


  //  ------------------------------------------------------- Sesiones de Apoyo -------------------------------------------------------
  //  ---------------------------------------------------------------------------------------------------------------------
  const mapSessions = (data: any[]) => {
    return data.map((s) => ({
      id: s.sol_ID,
      studentId: s.est_ID,
      studentName: s.est_NombreCompleto,
      mainReason: s.sol_MotivoConsulta,
      emotionalLevel: s.sol_MalestarEmocional,
      preferredTime: s.sol_HorarioPref,
      previousSessions: s.sol_Asistencia ? "Sí" : "No",
      createdAt: s.sol_FechaCreacion,
      status: s.sol_Cancelacion
        ? "cancelada"
        : s.sol_Asignada
          ? "asignada"
          : "pendiente",
      sol_Cancelacion: s.sol_Cancelacion,
      raw: s
    }));
  };

  const loadSupportSessions = async () => {
    try {
      const data = await fetchSolicitudApoyo();
      const mapped = mapSessions(data);
      setSupportSessions(mapped);
    } catch (err) {
      console.error("Error cargando las sesiones", err);
    }
  };


  useEffect(() => {
    loadSupportSessions();
  }, []);


  const addSupportSession = async (payload: any) => {
    const message = await createSolicitudApoyoAPI(payload);
    if (message.toLowerCase().includes("exitosamente")) {
      await loadSupportSessions();
    }
    return message;
  };


  const updateSupportSession = async (id: number, payload: any) => {
    const message = await updateSolicitudApoyoAPI(payload);
    if (message.toLowerCase().includes("exitosamente")) {
      await loadSupportSessions();
    }
    return message;
  };

  const cancelSupportSession = async (id: number, payload: any) => {
    const message = await deleteSolicitudApoyoAPI(payload);
    if (message.toLowerCase().includes("exitosamente")) {
      await loadSupportSessions();
    }
    return message;
  };

  // Action Plans
  const addActionPlan = (plan: Omit<ActionPlan, "id" | "createdAt">) => {
    const newPlan: ActionPlan = {
      ...plan,
      id: generateId("plan"),
      createdAt: new Date().toISOString(),
    };
    setActionPlans((prev) => [...prev, newPlan]);
  };

  // Dental Appointments
  const addDentalAppointment = (
    appointment: Omit<DentalAppointment, "id" | "createdAt">
  ) => {
    const newAppointment: DentalAppointment = {
      ...appointment,
      id: generateId("dental"),
      createdAt: new Date().toISOString(),
    };
    setDentalAppointments((prev) => [...prev, newAppointment]);
  };

  const updateDentalAppointment = (
    id: string,
    updates: Partial<DentalAppointment>
  ) => {
    setDentalAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === id ? { ...appointment, ...updates } : appointment
      )
    );
  };

  // Medical Check-ins
  const addMedicalCheckIn = (
    checkIn: Omit<MedicalCheckIn, "id" | "createdAt">
  ) => {
    const newCheckIn: MedicalCheckIn = {
      ...checkIn,
      id: generateId("medical"),
      createdAt: new Date().toISOString(),
    };
    setMedicalCheckIns((prev) => [...prev, newCheckIn]);
  };

  const updateMedicalCheckIn = (
    id: string,
    updates: Partial<MedicalCheckIn>
  ) => {
    setMedicalCheckIns((prev) =>
      prev.map((checkIn) =>
        checkIn.id === id ? { ...checkIn, ...updates } : checkIn
      )
    );
  };

  // Academic Consultations
  const addAcademicConsultation = (
    consultation: Omit<AcademicConsultation, "id" | "createdAt">
  ) => {
    const newConsultation: AcademicConsultation = {
      ...consultation,
      id: generateId("academic"),
      createdAt: new Date().toISOString(),
    };
    setAcademicConsultations((prev) => [...prev, newConsultation]);
  };

  const updateAcademicConsultation = (
    id: string,
    updates: Partial<AcademicConsultation>
  ) => {
    setAcademicConsultations((prev) =>
      prev.map((consultation) =>
        consultation.id === id ? { ...consultation, ...updates } : consultation
      )
    );
  };

  // Dental Treatments
  const addDentalTreatment = (
    treatment: Omit<DentalTreatment, "id" | "createdAt">
  ) => {
    const newTreatment: DentalTreatment = {
      ...treatment,
      id: generateId("treatment"),
      createdAt: new Date().toISOString(),
    };
    setDentalTreatments((prev) => [...prev, newTreatment]);
  };

  const updateDentalTreatment = (
    id: string,
    updates: Partial<DentalTreatment>
  ) => {
    setDentalTreatments((prev) =>
      prev.map((treatment) =>
        treatment.id === id ? { ...treatment, ...updates } : treatment
      )
    );
  };

  //  ------------------------------------------------------- Areas -------------------------------------------------------
  //  ---------------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    const loadAreas = async () => {
      try {
        const data = await fetchAreas();
        const formatted = data.map((a: any) => ({
          are_ID: a.are_ID,
          are_Nombre: a.are_Nombre,
          are_Estado: a.are_Estado,
          are_FechaCreacion: a.are_FechaCreacion,
          usu_UsuarioCreacion: a.usu_UsuarioCreacion,
          nombreCompleto_C: a.nombreCompleto_C,
          are_FechaModificacion: a.are_FechaModificacion,
          usu_UsuarioModificacion: a.usu_UsuarioModificacion,
          nombreCompleto_M: a.nombreCompleto_M,
          are_FechaEliminacion: a.are_FechaEliminacion,
          usu_UsuarioEliminacion: a.usu_UsuarioEliminacion,
          nombreCompleto_E: a.nombreCompleto_E,
        }));
        setAreas(formatted);
      } catch (err) {
        console.error("Error cargando áreas", err);
      }
    };

    loadAreas();
  }, []);

  const addArea = async (payload: any) => {
    const message = await createAreaAPI(payload);
    if (message.toLowerCase().includes("correctamente")) {
      const data = await fetchAreas();
      setAreas(data);
    }
    return message;
  };

  const updateArea = async (id: number, payload: any) => {
    const message = await updateAreaAPI(payload);
    if (message.toLowerCase().includes("correctamente")) {
      const data = await fetchAreas();
      setAreas(data);
    }
    return message;
  };

  const deleteArea = async (id: number, payload: any) => {
    const message = await deleteAreaAPI(payload);
    if (message.toLowerCase().includes("exitosamente")) {
      const data = await fetchAreas();
      setAreas(data);
    }
    return message;
  };
  //  ------------------------------------------------------- Tipo Tratamiento -------------------------------------------------------
  //  --------------------------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    const loadTreatmentTypes = async () => {
      try {
        const data = await fetchTipoTratamientos();
        const formatted = data.map((a: any) => ({
          tra_ID: a.tra_ID,
          tra_Descripcion: a.tra_Descripcion,
          tra_Estado: a.tra_Estado,
          tra_FechaCreacion: a.tra_FechaCreacion,
          usu_UsuarioCreacion: a.usu_UsuarioCreacion,
          nombreCompleto_C: a.nombreCompleto_C,
          tra_FechaModificacion: a.tra_FechaModificacion,
          usu_UsuarioModificacion: a.usu_UsuarioModificacion,
          nombreCompleto_M: a.nombreCompleto_M,
          tra_FechaEliminacion: a.tra_FechaEliminacion,
          usu_UsuarioEliminacion: a.usu_UsuarioEliminacion,
          nombreCompleto_E: a.nombreCompleto_E,
        }));
        setTreatmentTypes(formatted);
      } catch (err) {
        console.error("Error cargando los tipos de tratamiento", err);
      }
    };

    loadTreatmentTypes();
  }, []);

  const addTreatmentType = async (payload: any) => {
    const message = await createTipoTratamientoAPI(payload);
    if (message.toLowerCase().includes("correctamente")) {
      const data = await fetchTipoTratamientos();
      setTreatmentTypes(data);
    }
    return message;
  };

  const updateTreatmentType = async (id: number, payload: any) => {
    const message = await updateTipoTratamientoAPI(payload);
    if (message.toLowerCase().includes("correctamente")) {
      const data = await fetchTipoTratamientos();
      setTreatmentTypes(data);
    }
    return message;
  };

  const deleteTreatmentType = async (id: number, payload: any) => {
    const message = await deleteTipoTratamientoAPI(payload);
    if (message.toLowerCase().includes("exitosamente")) {
      const data = await fetchTipoTratamientos();
      setTreatmentTypes(data);
    }
    return message;
  };
  //  ------------------------------------------------------- Tipos de Consulta -------------------------------------------------------
  //  -------------------------------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    const loadConsultationType = async () => {
      try {
        const data = await fetchTipoConsultas();
        const formatted = data.map((a: any) => ({
          tic_ID: a.tic_ID,
          tic_Descripcion: a.tic_Descripcion,
          tic_Estado: a.tic_Estado,
          tic_FechaCreacion: a.tic_FechaCreacion,
          usu_UsuarioCreacion: a.usu_UsuarioCreacion,
          nombreCompleto_C: a.nombreCompleto_C,
          tic_FechaModificacion: a.tic_FechaModificacion,
          usu_UsuarioModificacion: a.usu_UsuarioModificacion,
          nombreCompleto_M: a.nombreCompleto_M,
          tic_FechaEliminacion: a.tic_FechaEliminacion,
          usu_UsuarioEliminacion: a.usu_UsuarioEliminacion,
          nombreCompleto_E: a.nombreCompleto_E,
        }));
        setConsultationTypes(formatted);
      } catch (err) {
        console.error("Error cargando los tipos de consultas", err);
      }
    };
    loadConsultationType();
  }, []);


  const addConsultationType = async (payload: any) => {
    const message = await createTipoConsultaAPI(payload);
    if (message.toLowerCase().includes("correctamente")) {
      const data = await fetchTipoConsultas();
      setConsultationTypes(data);
    }
    return message;
  };

  const updateConsultationType = async (id: number, payload: any) => {
    const message = await updateTipoConsultaAPI(payload);
    if (message.toLowerCase().includes("correctamente")) {
      const data = await fetchTipoConsultas();
      setConsultationTypes(data);
    }
    return message;
  };

  const deleteConsultationType = async (id: number, payload: any) => {
    const message = await deleteTipoConsultaAPI(payload);
    if (message.toLowerCase().includes("exitosamente")) {
      const data = await fetchTipoConsultas();
      setConsultationTypes(data);
    }
    return message;
  };
  //  ------------------------------------------------------- Usuarios -------------------------------------------------------
  //  ------------------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    const loadUsuarios = async () => {
      try {
        const data = await fetchUsuarios();
        const formatted = data.map((a: any) => ({
          usu_ID: a.usu_ID,
          usu_Usuario: a.usu_Usuario,
          per_ID: a.per_ID,
          per_Nombres: a.per_Nombres,
          rol_ID: a.rol_ID,
          rol_Descripcion: a.rol_Descripcion,
          usu_Estado: a.usu_Estado,
          usu_FechaCreacion: a.usu_FechaCreacion,
          usu_UsuarioCreacion: a.usu_UsuarioCreacion,
          nombreCompleto_C: a.nombreCompleto_C,
          usu_FechaModificacion: a.usu_FechaModificacion,
          usu_UsuarioModificacion: a.usu_UsuarioModificacion,
          nombreCompleto_M: a.nombreCompleto_M,
          usu_FechaEliminacion: a.usu_FechaEliminacion,
          usu_UsuarioEliminacion: a.usu_UsuarioEliminacion,
          nombreCompleto_E: a.nombreCompleto_E,
        }));
        setSystemUsers(formatted);
      } catch (err) {
        console.error("Error cargando los usuarios", err);
      }
    };
    loadUsuarios();
  }, []);

  const addSystemUser = async (payload: any) => {
    const message = await createUsuarioAPI(payload);
    if (message.toLowerCase().includes("correctamente")) {
      const data = await fetchUsuarios();
      setSystemUsers(data);
    }
    return message;
  };

  const updateSystemUser = async (id: number, payload: any) => {
    const message = await updateUsuarioAPI(payload);
    if (message.toLowerCase().includes("correctamente")) {
      const data = await fetchUsuarios();
      setSystemUsers(data);
    }
    return message;
  };

  const deleteSystemUser = async (id: number, payload: any) => {
    const message = await deleteUsuarioAPI(payload);
    if (message.toLowerCase().includes("exitosamente")) {
      const data = await fetchUsuarios();
      setSystemUsers(data);
    }
    return message;
  };
  //  ------------------------------------------------------- Personal -------------------------------------------------------
  //  ---------------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    const loadPersonalSinUsuario = async () => {
      try {
        const data = await fetchPersonalSinUsuario();
        const formatted = data.map((a: any) => ({
          per_ID: a.per_ID,
          per_Nombres: a.per_Nombres,
          per_Correo: a.per_Correo
        }));
        setPersonalSinUsuario(formatted);
      } catch (err) {
        console.error("Error cargando el personal", err);
      }
    };
    loadPersonalSinUsuario();
  }, []);

  useEffect(() => {
    const loadPersonal = async () => {
      try {
        const data = await fetchPersonal();
        const formatted = data.map((a: any) => ({
          per_ID: a.per_ID,
          per_Nombres: a.per_Nombres,
          per_Apellidos: a.per_Apellidos,
          estadoCivil: a.estadoCivil,
          per_EstadoCivil: a.per_EstadoCivil,
          sexo: a.sexo,
          per_Sexo: a.per_Sexo,
          per_FechaNac: a.per_FechaNac,
          per_Telefono: a.per_Telefono,
          per_Direccion: a.per_Direccion,
          per_Correo: a.per_Correo,
          are_ID: a.are_ID,
          are_Nombre: a.are_Nombre,
          per_Estado: a.per_Estado,

          per_FechaCreacion: a.usu_FechaCreacion,
          usu_UsuarioCreacion: a.usu_UsuarioCreacion,
          nombreCompleto_C: a.nombreCompleto_C,
          per_FechaModificacion: a.usu_FechaModificacion,
          usu_UsuarioModificacion: a.usu_UsuarioModificacion,
          nombreCompleto_M: a.nombreCompleto_M,
          per_FechaEliminacion: a.usu_FechaEliminacion,
          usu_UsuarioEliminacion: a.usu_UsuarioEliminacion,
          nombreCompleto_E: a.nombreCompleto_E,
        }));
        setPersonnel(formatted);
      } catch (err) {
        console.error("Error cargando el personal", err);
      }
    };
    loadPersonal();
  }, []);

  const addPersonnel = async (payload: any) => {
    const message = await createPersonalAPI(payload);
    if (message.toLowerCase().includes("correctamente")) {
      const data = await fetchPersonal();
      setPersonnel(data);
    }
    return message;
  };

  const updatePersonnel = async (id: number, payload: any) => {
    const message = await updatePersonalAPI(payload);
    if (message.toLowerCase().includes("correctamente")) {
      const data = await fetchPersonal();
      setPersonnel(data);
    }
    return message;
  };

  const deletePersonnel = async (id: number, payload: any) => {
    const message = await deletePersonalAPI(payload);
    if (message.toLowerCase().includes("exitosamente")) {
      const data = await fetchPersonal();
      setPersonnel(data);
    }
    return message;
  };

  //  ------------------------------------------------------- Roles -------------------------------------------------------
  //  ---------------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const data = await fetchRoles();
        const formatted = data.map((a: any) => ({
          rol_ID: a.rol_ID,
          rol_Descripcion: a.rol_Descripcion,
          rol_Estado: a.rol_Estado,
          rol_FechaCreacion: a.rol_FechaCreacion,
          usu_UsuarioCreacion: a.usu_UsuarioCreacion,
          nombreCompleto_C: a.nombreCompleto_C,
          rol_FechaModificacion: a.rol_FechaModificacion,
          usu_UsuarioModificacion: a.usu_UsuarioModificacion,
          nombreCompleto_M: a.nombreCompleto_M,
          rol_FechaEliminacion: a.rol_FechaEliminacion,
          usu_UsuarioEliminacion: a.usu_UsuarioEliminacion,
          nombreCompleto_E: a.nombreCompleto_E,
        }));
        setRoles(formatted);
      } catch (err) {
        console.error("Error cargando roles", err);
      }
    };

    loadRoles();
  }, []);

  const addRole = async (payload: any) => {
    const message = await createRolesAPI(payload);
    if (message.toLowerCase().includes("correctamente")) {
      const data = await fetchRoles();
      setRoles(data);
    }
    return message;
  };

  const updateRole = async (id: number, payload: any) => {
    const message = await updateRolesAPI(payload);
    if (message.toLowerCase().includes("correctamente")) {
      const data = await fetchRoles();
      setRoles(data);
    }
    return message;
  };

  const deleteRole = async (id: number, payload: any) => {
    const message = await deleteRolesAPI(payload);
    if (message.toLowerCase().includes("exitosamente")) {
      const data = await fetchRoles();
      setRoles(data);
    }
    return message;
  };

  return (
    <DataContext.Provider
      value={{
        supportSessions,
        addSupportSession,
        updateSupportSession,
        cancelSupportSession,
        actionPlans,
        addActionPlan,
        dentalAppointments,
        addDentalAppointment,
        updateDentalAppointment,
        dentalTreatments,
        addDentalTreatment,
        updateDentalTreatment,
        medicalCheckIns,
        addMedicalCheckIn,
        updateMedicalCheckIn,
        academicConsultations,
        addAcademicConsultation,
        updateAcademicConsultation,
        areas,
        addArea,
        updateArea,
        deleteArea,
        personnel,
        addPersonnel,
        updatePersonnel,
        deletePersonnel,
        personalSinUsuario,
        roles,
        addRole,
        updateRole,
        deleteRole,
        systemUsers,
        addSystemUser,
        updateSystemUser,
        deleteSystemUser,
        consultationTypes,
        addConsultationType,
        updateConsultationType,
        deleteConsultationType,
        treatmentTypes,
        addTreatmentType,
        updateTreatmentType,
        deleteTreatmentType,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
