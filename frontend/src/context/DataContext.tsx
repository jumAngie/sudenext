import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SupportSession, ActionPlan, DentalAppointment,
  MedicalCheckIn, AcademicConsultation, DentalTreatment,
  Area, Personnel, Role, SystemUser, ConsultationType, TreatmentType
} from '../types';
import { fetchAreas, createAreaAPI, updateAreaAPI, deleteAreaAPI } from "/src/services/areaService.ts";

interface DataContextType {
  // Support Sessions
  supportSessions: SupportSession[];
  addSupportSession: (session: Omit<SupportSession, 'id' | 'createdAt'>) => void;
  updateSupportSession: (id: string, updates: Partial<SupportSession>) => void;

  // Action Plans
  actionPlans: ActionPlan[];
  addActionPlan: (plan: Omit<ActionPlan, 'id' | 'createdAt'>) => void;

  // Dental Appointments
  dentalAppointments: DentalAppointment[];
  addDentalAppointment: (appointment: Omit<DentalAppointment, 'id' | 'createdAt'>) => void;
  updateDentalAppointment: (id: string, updates: Partial<DentalAppointment>) => void;

  // Dental Treatments
  dentalTreatments: DentalTreatment[];
  addDentalTreatment: (treatment: Omit<DentalTreatment, 'id' | 'createdAt'>) => void;
  updateDentalTreatment: (id: string, updates: Partial<DentalTreatment>) => void;

  // Medical Check-ins
  medicalCheckIns: MedicalCheckIn[];
  addMedicalCheckIn: (checkIn: Omit<MedicalCheckIn, 'id' | 'createdAt'>) => void;
  updateMedicalCheckIn: (id: string, updates: Partial<MedicalCheckIn>) => void;

  // Academic Consultations
  academicConsultations: AcademicConsultation[];
  addAcademicConsultation: (consultation: Omit<AcademicConsultation, 'id' | 'createdAt'>) => void;
  updateAcademicConsultation: (id: string, updates: Partial<AcademicConsultation>) => void;

  // Areas
  areas: Area[];
  addArea: (payload: {
    are_Nombre: string;
    usu_UsuarioCreacion: number;
    are_FechaCreacion: string;
  }) => Promise<void>;

  updateArea: (id: number, payload: {
    are_Nombre: string;
    usu_UsuarioModificacion: number;
    are_FechaModificacion: string;
  }) => Promise<void>;

  deleteArea: (
    id: number,
    payload: {
      are_ID: number;
      are_Nombre: string;
      usu_UsuarioCreacion: number | null;
      are_FechaCreacion: string | null;
      usu_UsuarioModificacion: number | null;
      are_FechaModificacion: string | null;
      usu_UsuarioEliminacion: number;
      are_FechaEliminacion: string;
      are_Estado: boolean;
    }
  ) => Promise<void>;

  // Personnel
  personnel: Personnel[];
  addPersonnel: (person: Omit<Personnel, 'id' | 'createdAt'>) => void;
  updatePersonnel: (id: string, updates: Partial<Personnel>) => void;
  deletePersonnel: (id: string) => void;

  // Roles
  roles: Role[];
  addRole: (role: Omit<Role, 'id' | 'createdAt'>) => void;
  updateRole: (id: string, updates: Partial<Role>) => void;
  deleteRole: (id: string) => void;

  // System Users
  systemUsers: SystemUser[];
  addSystemUser: (user: Omit<SystemUser, 'id' | 'createdAt'>) => void;
  updateSystemUser: (id: string, updates: Partial<SystemUser>) => void;
  deleteSystemUser: (id: string) => void;

  // Consultation Types
  consultationTypes: ConsultationType[];
  addConsultationType: (type: Omit<ConsultationType, 'id' | 'createdAt'>) => void;
  updateConsultationType: (id: string, updates: Partial<ConsultationType>) => void;
  deleteConsultationType: (id: string) => void;

  // Treatment Types
  treatmentTypes: TreatmentType[];
  addTreatmentType: (type: Omit<TreatmentType, 'id' | 'createdAt'>) => void;
  updateTreatmentType: (id: string, updates: Partial<TreatmentType>) => void;
  deleteTreatmentType: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper function to get dates for the current month
const getCurrentMonthDates = () => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  return {
    // Tomorrow
    tomorrow: new Date(currentYear, currentMonth, today.getDate() + 1).toISOString(),
    // Day after tomorrow
    dayAfter: new Date(currentYear, currentMonth, today.getDate() + 2).toISOString(),
    // Next week
    nextWeek: new Date(currentYear, currentMonth, today.getDate() + 7).toISOString(),
    // In 10 days
    inTenDays: new Date(currentYear, currentMonth, today.getDate() + 10).toISOString(),
    // In 15 days
    inFifteenDays: new Date(currentYear, currentMonth, today.getDate() + 15).toISOString(),
    // In 20 days
    inTwentyDays: new Date(currentYear, currentMonth, today.getDate() + 20).toISOString(),
  };
};

// Mock initial data
const dates = getCurrentMonthDates();

const initialSupportSessions: SupportSession[] = [
  {
    id: 'support-1',
    studentId: 'student-1',
    studentName: 'Angie Yahaira Campos Arias',
    accountNumber: '20222000215',
    mainReason: 'Estrés académico y ansiedad antes de los exámenes finales. Necesito técnicas para manejar la presión.',
    emotionalLevel: 4,
    previousSessions: false,
    preferredTime: '09:00',
    modality: 'presencial',
    additionalComments: 'Prefiero sesiones en horario matutino',
    status: 'pendiente',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'support-2',
    studentId: 'student-2',
    studentName: 'Cindy Nicole Reyes Arevalo',
    accountNumber: '20222000224',
    mainReason: 'Dificultades para concentrarme en los estudios debido a problemas familiares',
    emotionalLevel: 3,
    previousSessions: true,
    preferredTime: '14:00',
    modality: 'virtual',
    status: 'asignada',
    assignedCounselorId: 'staff-5',
    assignedCounselorName: 'Elder Alexandro Lopez',
    createdAt: '2024-01-14T08:15:00Z',
    scheduledAt: dates.tomorrow
  },
  {
    id: 'support-3',
    studentId: 'student-3',
    studentName: 'Elmer Isai Alvarez Carbajal',
    accountNumber: '20210001123',
    mainReason: 'Ansiedad social y dificultades para hacer amigos en la universidad',
    emotionalLevel: 5,
    previousSessions: false,
    preferredTime: '10:00',
    modality: 'presencial',
    additionalComments: 'Me siento muy nervioso al hablar con nuevas personas',
    status: 'asignada',
    assignedCounselorId: 'staff-5',
    assignedCounselorName: 'Elder Alexandro Lopez',
    createdAt: '2024-01-16T09:20:00Z',
    scheduledAt: dates.dayAfter
  },
  {
    id: 'support-4',
    studentId: 'student-4',
    studentName: 'Juan David Molina Sagastume',
    accountNumber: '20240128910',
    mainReason: 'Procrastinación crónica y falta de motivación para estudiar',
    emotionalLevel: 2,
    previousSessions: true,
    preferredTime: '15:00',
    modality: 'virtual',
    status: 'completada',
    assignedCounselorId: 'staff-5',
    assignedCounselorName: 'Elder Alexandro Lopez',
    createdAt: '2024-01-10T11:45:00Z',
    scheduledAt: dates.nextWeek
  },
  {
    id: 'support-5',
    studentId: 'student-5',
    studentName: 'Luis Mario Aguilera Valle',
    accountNumber: '20222000120',
    mainReason: 'Presión por parte de los padres para mantener excelencia académica',
    emotionalLevel: 4,
    previousSessions: false,
    preferredTime: '11:00',
    modality: 'presencial',
    additionalComments: 'Mis padres esperan que sea perfecto y me genera mucha ansiedad',
    status: 'asignada',
    assignedCounselorId: 'staff-5',
    assignedCounselorName: 'Elder Alexandro Lopez',
    createdAt: '2024-01-17T13:30:00Z',
    scheduledAt: dates.inTenDays
  },
  {
    id: 'support-6',
    studentId: 'student-6',
    studentName: 'Nathaly Valeria Durán Castillo',
    accountNumber: '20222000123',
    mainReason: 'Duelo por pérdida familiar que está afectando mi rendimiento académico',
    emotionalLevel: 5,
    previousSessions: false,
    preferredTime: '16:00',
    modality: 'presencial',
    additionalComments: 'Perdí a mi abuelo hace un mes y no he podido concentrarme',
    status: 'asignada',
    assignedCounselorId: 'staff-5',
    assignedCounselorName: 'Elder Alexandro Lopez',
    createdAt: '2024-01-18T10:15:00Z',
    scheduledAt: dates.inFifteenDays
  },
  {
    id: 'support-7',
    studentId: 'student-7',
    studentName: 'Gerson David Franco Lobo',
    accountNumber: '20222000125',
    mainReason: 'Baja autoestima y dudas sobre mi elección de carrera',
    emotionalLevel: 3,
    previousSessions: true,
    preferredTime: '13:00',
    modality: 'virtual',
    status: 'asignada',
    assignedCounselorId: 'staff-5',
    assignedCounselorName: 'Elder Alexandro Lopez',
    createdAt: '2024-01-19T14:20:00Z',
    scheduledAt: dates.inTwentyDays
  },
  {
    id: 'support-8',
    studentId: 'student-8',
    studentName: 'Jasser Evelio George Martinez',
    accountNumber: '20222000187',
    mainReason: 'Ataques de pánico durante los exámenes',
    emotionalLevel: 5,
    previousSessions: false,
    preferredTime: '09:30',
    modality: 'presencial',
    additionalComments: 'Los síntomas aparecen especialmente en matemáticas',
    status: 'pendiente',
    createdAt: '2024-01-20T08:45:00Z'
  }
];

const initialDentalAppointments: DentalAppointment[] = [
  {
    id: 'dental-1',
    studentId: 'student-3',
    studentName: 'Elmer Isai Alvarez Carbajal',
    accountNumber: '20210001123',
    preferredDate: '2024-01-25',
    preferredTime: '10:00',
    reason: 'Dolor en muela del juicio',
    priority: 'alta',
    status: 'pendiente',
    createdAt: '2024-01-16T11:00:00Z'
  },
  {
    id: 'dental-2',
    studentId: 'student-4',
    studentName: 'Juan David Molina Sagastume',
    accountNumber: '20240128910',
    preferredDate: '2024-01-28',
    preferredTime: '14:00',
    reason: 'Limpieza dental de rutina',
    priority: 'baja',
    status: 'confirmada',
    assignedDentistId: 'staff-2',
    assignedDentistName: 'Sherlyn Nicole Monje',
    createdAt: '2024-01-18T09:30:00Z'
  },
  {
    id: 'dental-3',
    studentId: 'student-9',
    studentName: 'Mario Deniel Hernandez',
    accountNumber: '20222000200',
    preferredDate: '2024-02-02',
    preferredTime: '09:00',
    reason: 'Revisión de ortodoncia',
    priority: 'media',
    status: 'pendiente',
    createdAt: '2024-01-22T10:15:00Z'
  }
];

const initialMedicalCheckIns: MedicalCheckIn[] = [
  {
    id: 'medical-1',
    studentId: 'student-1',
    studentName: 'Angie Yahaira Campos Arias',
    accountNumber: '20222000215',
    symptoms: ['Dolor de cabeza', 'Fatiga'],
    temperature: 36.8,
    bloodPressure: '120/80',
    observations: 'Dolor de cabeza por estrés académico. Se recomienda descanso.',
    attended: true,
    createdAt: '2024-01-16T08:30:00Z'
  },
  {
    id: 'medical-2',
    studentId: 'student-2',
    studentName: 'Cindy Nicole Reyes Arevalo',
    accountNumber: '20222000224',
    symptoms: [],
    temperature: 36.5,
    bloodPressure: '118/75',
    observations: 'Check-up de rutina. Valores normales.',
    attended: true,
    createdAt: '2024-01-17T10:15:00Z'
  },
  {
    id: 'medical-3',
    studentId: 'student-6',
    studentName: 'Nathaly Valeria Durán Castillo',
    accountNumber: '20222000123',
    symptoms: ['Tos', 'Dolor de garganta'],
    temperature: 37.2,
    bloodPressure: '115/70',
    observations: 'Síntomas de resfriado común. Se prescribe reposo.',
    attended: true,
    createdAt: '2024-01-18T09:45:00Z'
  },
  {
    id: 'medical-4',
    studentId: 'student-8',
    studentName: 'Jasser Evelio George Martinez',
    accountNumber: '20222000187',
    symptoms: ['Dolor abdominal'],
    temperature: 37.8,
    bloodPressure: '125/85',
    observations: 'Dolor abdominal posiblemente relacionado con estrés.',
    attended: false,
    createdAt: '2024-01-19T11:20:00Z'
  }
];

const initialAcademicConsultations: AcademicConsultation[] = [
  {
    id: 'academic-1',
    studentId: 'student-5',
    studentName: 'Luis Mario Aguilera Valle',
    accountNumber: '20222000120',
    consultationType: 'Orientación Académica',
    description: 'Dudas sobre especialización en enfermería geriátrica',
    advisorId: 'staff-4',
    advisorName: 'Denis Roberto García',
    resolution: 'Se recomienda tomar cursos electivos en geriatría antes de decidir la especialización',
    followUpRequired: true,
    followUpDate: '2024-02-15',
    status: 'completada',
    createdAt: '2024-01-15T11:00:00Z',
    completedAt: '2024-01-15T11:45:00Z'
  },
  {
    id: 'academic-2',
    studentId: 'student-7',
    studentName: 'Gerson David Franco Lobo',
    accountNumber: '20222000125',
    consultationType: 'Dificultades Académicas',
    description: 'Bajo rendimiento en filosofía medieval y necesidad de apoyo adicional',
    advisorId: 'staff-4',
    advisorName: 'Denis Roberto García',
    followUpRequired: true,
    status: 'pendiente',
    createdAt: '2024-01-18T14:30:00Z'
  },
  {
    id: 'academic-3',
    studentId: 'student-10',
    studentName: 'Miriam Alicia Rojas',
    accountNumber: '20222001203',
    consultationType: 'Cambio de Carrera',
    description: 'Interés en cambiar de Pedagogía a Psicología Educativa',
    advisorId: 'staff-4',
    advisorName: 'Denis Roberto García',
    resolution: 'Se explicaron los procedimientos para cambio de carrera y requisitos académicos',
    followUpRequired: false,
    status: 'completada',
    createdAt: '2024-01-20T10:15:00Z',
    completedAt: '2024-01-20T11:00:00Z'
  }
];

const initialDentalTreatments: DentalTreatment[] = [
  {
    id: 'treatment-1',
    appointmentId: 'dental-2',
    studentId: 'student-4',
    studentName: 'Juan David Molina Sagastume',
    accountNumber: '20240128910',
    dentistId: 'staff-2',
    dentistName: 'Sherlyn Nicole Monje',
    treatmentType: 'Limpieza Dental',
    treatmentDescription: 'Profilaxis dental de rutina',
    diagnosis: 'Gingivitis leve, acumulación de placa bacteriana',
    proceduresPerformed: ['Limpieza supragingival', 'Pulido dental', 'Aplicación de flúor'],
    materialsUsed: ['Pasta profiláctica', 'Flúor gel'],
    duration: 45,
    cost: 150,
    requiresFollowUp: true,
    followUpDate: '2024-07-28',
    followUpInstructions: 'Cepillado dental 3 veces al día, uso de hilo dental diario, enjuague bucal',
    notes: 'Paciente cooperativo. Se explicaron técnicas de higiene oral.',
    status: 'completado',
    createdAt: '2024-01-28T14:00:00Z',
    completedAt: '2024-01-28T14:45:00Z'
  }
];

const initialAreas: Area[] = [];

const initialPersonnel: Personnel[] = [
  {
    id: 'person-1',
    name: 'Dra. Sherlyn Nicole Monje',
    email: 'sherlyn.monje@unah.edu.hn',
    phone: '9876-5432',
    areaId: 'area-1',
    areaName: 'Odontología',
    position: 'Odontóloga',
    isActive: true,
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'person-2',
    name: 'Dr. Marvin Adonay Alvarenga',
    email: 'marvin.alvarenga@unah.edu.hn',
    phone: '9876-5433',
    areaId: 'area-2',
    areaName: 'Medicina General',
    position: 'Médico General',
    isActive: true,
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'person-3',
    name: 'Lic. Elder Alexandro Lopez',
    email: 'elder.lopez@unah.edu.hn',
    phone: '9876-5434',
    areaId: 'area-3',
    areaName: 'Psicología',
    position: 'Psicólogo/Consejero',
    isActive: true,
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'person-4',
    name: 'Lic. Denis Roberto García',
    email: 'denis.garcia@unah.edu.hn',
    phone: '9876-5435',
    areaId: 'area-4',
    areaName: 'Asesoría Académica',
    position: 'Asesor Académico',
    isActive: true,
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'person-5',
    name: 'Lic. Carlos Roberto Mejía',
    email: 'carlos.mejia@unah.edu.hn',
    phone: '9876-5436',
    areaId: 'area-5',
    areaName: 'Administración',
    position: 'Administrador General',
    isActive: true,
    createdAt: '2024-01-01T08:00:00Z'
  }
];

const initialRoles: Role[] = [
  {
    id: 'role-1',
    name: 'Administrador',
    description: 'Acceso completo a todas las funcionalidades del sistema',
    permissions: ['crear', 'editar', 'eliminar', 'ver_reportes', 'gestionar_usuarios'],
    isActive: true,
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'role-2',
    name: 'Odontólogo',
    description: 'Acceso a funcionalidades de odontología',
    permissions: ['registrar_tratamientos', 'ver_citas_dentales'],
    isActive: true,
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'role-3',
    name: 'Médico General',
    description: 'Acceso a funcionalidades de medicina general',
    permissions: ['atender_pacientes', 'ver_checkins'],
    isActive: true,
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'role-4',
    name: 'Consejero',
    description: 'Acceso a funcionalidades de psicología',
    permissions: ['crear_planes', 'ver_sesiones_apoyo'],
    isActive: true,
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'role-5',
    name: 'Asesor Académico',
    description: 'Acceso a funcionalidades de asesoría académica',
    permissions: ['gestionar_consultas', 'ver_consultas_academicas'],
    isActive: true,
    createdAt: '2024-01-01T08:00:00Z'
  }
];

const initialSystemUsers: SystemUser[] = [
  {
    id: 'user-1',
    name: 'Carlos Roberto Mejía',
    email: 'carlos.mejia@unah.edu.hn',
    roleId: 'role-1',
    roleName: 'Administrador',
    isActive: true,
    lastLogin: '2024-01-28T09:30:00Z',
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'user-2',
    name: 'Sherlyn Nicole Monje',
    email: 'sherlyn.monje@unah.edu.hn',
    roleId: 'role-2',
    roleName: 'Odontólogo',
    isActive: true,
    lastLogin: '2024-01-28T08:15:00Z',
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'user-3',
    name: 'Marvin Adonay Alvarenga',
    email: 'marvin.alvarenga@unah.edu.hn',
    roleId: 'role-3',
    roleName: 'Médico General',
    isActive: true,
    lastLogin: '2024-01-27T14:20:00Z',
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'user-4',
    name: 'Elder Alexandro Lopez',
    email: 'elder.lopez@unah.edu.hn',
    roleId: 'role-4',
    roleName: 'Consejero',
    isActive: true,
    lastLogin: '2024-01-28T10:45:00Z',
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'user-5',
    name: 'Denis Roberto García',
    email: 'denis.garcia@unah.edu.hn',
    roleId: 'role-5',
    roleName: 'Asesor Académico',
    isActive: true,
    lastLogin: '2024-01-28T11:00:00Z',
    createdAt: '2024-01-01T08:00:00Z'
  }
];

const initialConsultationTypes: ConsultationType[] = [
  {
    id: 'consult-type-1',
    name: 'Orientación Académica',
    description: 'Asesoría sobre cursos, carreras y planificación académica',
    estimatedDuration: 30,
    isActive: true,
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'consult-type-2',
    name: 'Dificultades Académicas',
    description: 'Apoyo para estudiantes con bajo rendimiento académico',
    estimatedDuration: 45,
    isActive: true,
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'consult-type-3',
    name: 'Cambio de Carrera',
    description: 'Información sobre procedimientos y requisitos para cambio de carrera',
    estimatedDuration: 40,
    isActive: true,
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'consult-type-4',
    name: 'Tutoría Académica',
    description: 'Apoyo personalizado en áreas académicas específicas',
    estimatedDuration: 60,
    isActive: true,
    createdAt: '2024-01-01T08:00:00Z'
  }
];

const initialTreatmentTypes: TreatmentType[] = [
  {
    id: 'treatment-type-1',
    name: 'Limpieza Dental',
    description: 'Profilaxis y limpieza dental de rutina',
    estimatedDuration: 45,
    estimatedCost: 150,
    isActive: true,
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'treatment-type-2',
    name: 'Extracción Dental',
    description: 'Extracción de piezas dentales',
    estimatedDuration: 60,
    estimatedCost: 300,
    isActive: true,
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'treatment-type-3',
    name: 'Resina Dental',
    description: 'Restauración con resina compuesta',
    estimatedDuration: 50,
    estimatedCost: 200,
    isActive: true,
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'treatment-type-4',
    name: 'Endodoncia',
    description: 'Tratamiento de conducto radicular',
    estimatedDuration: 90,
    estimatedCost: 500,
    isActive: true,
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'treatment-type-5',
    name: 'Ortodoncia',
    description: 'Revisión y ajuste de aparatos ortodónticos',
    estimatedDuration: 30,
    estimatedCost: 250,
    isActive: true,
    createdAt: '2024-01-01T08:00:00Z'
  }
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [supportSessions, setSupportSessions] = useState<SupportSession[]>(initialSupportSessions);
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([]);
  const [dentalAppointments, setDentalAppointments] = useState<DentalAppointment[]>(initialDentalAppointments);
  const [dentalTreatments, setDentalTreatments] = useState<DentalTreatment[]>(initialDentalTreatments);
  const [medicalCheckIns, setMedicalCheckIns] = useState<MedicalCheckIn[]>(initialMedicalCheckIns);
  const [academicConsultations, setAcademicConsultations] = useState<AcademicConsultation[]>(initialAcademicConsultations);
  const [areas, setAreas] = useState<Area[]>([]);
  const [personnel, setPersonnel] = useState<Personnel[]>(initialPersonnel);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>(initialSystemUsers);
  const [consultationTypes, setConsultationTypes] = useState<ConsultationType[]>(initialConsultationTypes);
  const [treatmentTypes, setTreatmentTypes] = useState<TreatmentType[]>(initialTreatmentTypes);

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

  // Generate unique ID
  const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Support Sessions
  const addSupportSession = (session: Omit<SupportSession, 'id' | 'createdAt'>) => {
    const newSession: SupportSession = {
      ...session,
      id: generateId('support'),
      createdAt: new Date().toISOString()
    };
    setSupportSessions(prev => [...prev, newSession]);
  };

  const updateSupportSession = (id: string, updates: Partial<SupportSession>) => {
    setSupportSessions(prev =>
      prev.map(session =>
        session.id === id ? { ...session, ...updates } : session
      )
    );
  };

  // Action Plans
  const addActionPlan = (plan: Omit<ActionPlan, 'id' | 'createdAt'>) => {
    const newPlan: ActionPlan = {
      ...plan,
      id: generateId('plan'),
      createdAt: new Date().toISOString()
    };
    setActionPlans(prev => [...prev, newPlan]);
  };

  // Dental Appointments
  const addDentalAppointment = (appointment: Omit<DentalAppointment, 'id' | 'createdAt'>) => {
    const newAppointment: DentalAppointment = {
      ...appointment,
      id: generateId('dental'),
      createdAt: new Date().toISOString()
    };
    setDentalAppointments(prev => [...prev, newAppointment]);
  };

  const updateDentalAppointment = (id: string, updates: Partial<DentalAppointment>) => {
    setDentalAppointments(prev =>
      prev.map(appointment =>
        appointment.id === id ? { ...appointment, ...updates } : appointment
      )
    );
  };

  // Medical Check-ins
  const addMedicalCheckIn = (checkIn: Omit<MedicalCheckIn, 'id' | 'createdAt'>) => {
    const newCheckIn: MedicalCheckIn = {
      ...checkIn,
      id: generateId('medical'),
      createdAt: new Date().toISOString()
    };
    setMedicalCheckIns(prev => [...prev, newCheckIn]);
  };

  const updateMedicalCheckIn = (id: string, updates: Partial<MedicalCheckIn>) => {
    setMedicalCheckIns(prev =>
      prev.map(checkIn =>
        checkIn.id === id ? { ...checkIn, ...updates } : checkIn
      )
    );
  };

  // Academic Consultations
  const addAcademicConsultation = (consultation: Omit<AcademicConsultation, 'id' | 'createdAt'>) => {
    const newConsultation: AcademicConsultation = {
      ...consultation,
      id: generateId('academic'),
      createdAt: new Date().toISOString()
    };
    setAcademicConsultations(prev => [...prev, newConsultation]);
  };

  const updateAcademicConsultation = (id: string, updates: Partial<AcademicConsultation>) => {
    setAcademicConsultations(prev =>
      prev.map(consultation =>
        consultation.id === id ? { ...consultation, ...updates } : consultation
      )
    );
  };

  // Dental Treatments
  const addDentalTreatment = (treatment: Omit<DentalTreatment, 'id' | 'createdAt'>) => {
    const newTreatment: DentalTreatment = {
      ...treatment,
      id: generateId('treatment'),
      createdAt: new Date().toISOString()
    };
    setDentalTreatments(prev => [...prev, newTreatment]);
  };

  const updateDentalTreatment = (id: string, updates: Partial<DentalTreatment>) => {
    setDentalTreatments(prev =>
      prev.map(treatment =>
        treatment.id === id ? { ...treatment, ...updates } : treatment
      )
    );
  };

  // Areas
  const addArea = async (payload: {
    are_Nombre: string;
    usu_UsuarioCreacion: number;
    are_FechaCreacion: string;
  }) => {
    await createAreaAPI(payload);
    const data = await fetchAreas();
    setAreas(data);
  };

  const updateArea = async (id: number, payload: {
    are_Nombre: string;
    usu_UsuarioModificacion: number;
    are_FechaModificacion: string;
  }) => {
    await updateAreaAPI({ are_ID: id, ...payload });
    const data = await fetchAreas();
    setAreas(data);
  };

  const deleteArea = async (
    id: number,
    payload: {
      are_ID: number;
      are_Nombre: string;
      usu_UsuarioCreacion: number | null;
      are_FechaCreacion: string | null;
      usu_UsuarioModificacion: number | null;
      are_FechaModificacion: string | null;
      usu_UsuarioEliminacion: number;
      are_FechaEliminacion: string;
      are_Estado: boolean;
    }
  ) => {
    await deleteAreaAPI(payload);
    const data = await fetchAreas();
    setAreas(data);
  };



  // Personnel
  const addPersonnel = (person: Omit<Personnel, 'id' | 'createdAt'>) => {
    const newPerson: Personnel = {
      ...person,
      id: generateId('person'),
      createdAt: new Date().toISOString()
    };
    setPersonnel(prev => [...prev, newPerson]);
  };

  const updatePersonnel = (id: string, updates: Partial<Personnel>) => {
    setPersonnel(prev =>
      prev.map(person =>
        person.id === id ? { ...person, ...updates } : person
      )
    );
  };

  const deletePersonnel = (id: string) => {
    setPersonnel(prev => prev.filter(person => person.id !== id));
  };

  // Roles
  const addRole = (role: Omit<Role, 'id' | 'createdAt'>) => {
    const newRole: Role = {
      ...role,
      id: generateId('role'),
      createdAt: new Date().toISOString()
    };
    setRoles(prev => [...prev, newRole]);
  };

  const updateRole = (id: string, updates: Partial<Role>) => {
    setRoles(prev =>
      prev.map(role =>
        role.id === id ? { ...role, ...updates } : role
      )
    );
  };

  const deleteRole = (id: string) => {
    setRoles(prev => prev.filter(role => role.id !== id));
  };

  // System Users
  const addSystemUser = (user: Omit<SystemUser, 'id' | 'createdAt'>) => {
    const newUser: SystemUser = {
      ...user,
      id: generateId('user'),
      createdAt: new Date().toISOString()
    };
    setSystemUsers(prev => [...prev, newUser]);
  };

  const updateSystemUser = (id: string, updates: Partial<SystemUser>) => {
    setSystemUsers(prev =>
      prev.map(user =>
        user.id === id ? { ...user, ...updates } : user
      )
    );
  };

  const deleteSystemUser = (id: string) => {
    setSystemUsers(prev => prev.filter(user => user.id !== id));
  };

  // Consultation Types
  const addConsultationType = (type: Omit<ConsultationType, 'id' | 'createdAt'>) => {
    const newType: ConsultationType = {
      ...type,
      id: generateId('consult-type'),
      createdAt: new Date().toISOString()
    };
    setConsultationTypes(prev => [...prev, newType]);
  };

  const updateConsultationType = (id: string, updates: Partial<ConsultationType>) => {
    setConsultationTypes(prev =>
      prev.map(type =>
        type.id === id ? { ...type, ...updates } : type
      )
    );
  };

  const deleteConsultationType = (id: string) => {
    setConsultationTypes(prev => prev.filter(type => type.id !== id));
  };

  // Treatment Types
  const addTreatmentType = (type: Omit<TreatmentType, 'id' | 'createdAt'>) => {
    const newType: TreatmentType = {
      ...type,
      id: generateId('treatment-type'),
      createdAt: new Date().toISOString()
    };
    setTreatmentTypes(prev => [...prev, newType]);
  };

  const updateTreatmentType = (id: string, updates: Partial<TreatmentType>) => {
    setTreatmentTypes(prev =>
      prev.map(type =>
        type.id === id ? { ...type, ...updates } : type
      )
    );
  };

  const deleteTreatmentType = (id: string) => {
    setTreatmentTypes(prev => prev.filter(type => type.id !== id));
  };

  return (
    <DataContext.Provider value={{
      supportSessions,
      addSupportSession,
      updateSupportSession,
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
      deleteTreatmentType
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}