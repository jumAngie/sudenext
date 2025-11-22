export type UserRole = 'administrador' | 'odontologo' | 'medico_general' | 'asesor_academico' | 'consejero';

export interface Student {
  id: string;
  accountNumber: string;
  name: string;
  email: string;
  phone: string;
  career: string;
  password?: string; // Optional field for password changes
}

export interface StaffMember {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department: string;
  password?: string; // Optional field for password changes
}

export interface User {
  type: 'student' | 'staff';
  data: Student | StaffMember;
}

export interface SupportSession {
  id: string;
  studentId: string;
  studentName: string;
  accountNumber: string;
  mainReason: string;
  emotionalLevel: number;
  previousSessions: boolean;
  preferredTime: string;
  modality: 'virtual' | 'presencial';
  additionalComments?: string;
  status: 'pendiente' | 'asignada' | 'completada' | 'rechazada';
  assignedCounselorId?: string;
  assignedCounselorName?: string;
  createdAt: string;
  scheduledAt?: string;
}

export interface ActionPlan {
  id: string;
  sessionId: string;
  studentId: string;
  counselorId: string;
  sessionSummary: string;
  objectives: string[];
  suggestedActivities: string[];
  followUpDate: string;
  additionalObservations?: string;
  createdAt: string;
}

export interface DentalAppointment {
  id: string;
  studentId: string;
  studentName: string;
  accountNumber: string;
  preferredDate: string;
  preferredTime: string;
  reason: string;
  priority: 'baja' | 'media' | 'alta';
  status: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  assignedDentistId?: string;
  assignedDentistName?: string;
  createdAt: string;
  confirmedAt?: string;
}

export interface MedicalCheckIn {
  id: string;
  studentId: string;
  studentName: string;
  accountNumber: string;
  symptoms?: string[];
  temperature?: number;
  bloodPressure?: string;
  observations?: string;
  attended: boolean;
  createdAt: string;
}

export interface AcademicConsultation {
  id: string;
  studentId: string;
  studentName: string;
  accountNumber: string;
  consultationType: string;
  description: string;
  advisorId: string;
  advisorName: string;
  recommendations?: string;
  resolution?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  status: 'pendiente' | 'completada';
  createdAt: string;
  completedAt?: string;
}

export interface DentalTreatment {
  id: string;
  appointmentId: string;
  studentId: string;
  studentName: string;
  accountNumber: string;
  dentistId: string;
  dentistName: string;
  treatmentType: string;
  treatmentDescription: string;
  diagnosis: string;
  proceduresPerformed: string[];
  materialsUsed?: string[];
  duration: number; // in minutes
  cost?: number;
  requiresFollowUp: boolean;
  followUpDate?: string;
  followUpInstructions?: string;
  notes?: string;
  status: 'planificado' | 'en_progreso' | 'completado' | 'cancelado';
  createdAt: string;
  completedAt?: string;
}

// Administrative entities
export interface Area {
  are_ID: number;
  are_Nombre: string;
  are_Estado: boolean;
  
  are_FechaCreacion: string | null;
  usu_UsuarioCreacion: number | null;
  nombreCompleto_C: string | null;
  are_FechaModificacion: string | null;
  usu_UsuarioModificacion: number | null;
  nombreCompleto_M: string | null;
  are_FechaEliminacion: string | null;
  usu_UsuarioEliminacion: number | null;
  nombreCompleto_E: string | null;
}

export interface TreatmentType {
  tra_ID: number;
  tra_Descripcion: string;
  tra_Estado: boolean;

  tra_FechaCreacion: string | null;
  usu_UsuarioCreacion: number | null;
  nombreCompleto_C: string | null;
  tra_FechaModificacion: string | null;
  usu_UsuarioModificacion: number | null;
  nombreCompleto_M: string | null;
  tra_FechaEliminacion: string | null;
  usu_UsuarioEliminacion: number | null;
  nombreCompleto_E: string | null;
}

export interface ConsultationType {
  tic_ID: number;
  tic_Descripcion: string;
  tic_Estado: boolean;

  tic_FechaCreacion: string | null;
  usu_UsuarioCreacion: number | null;
  nombreCompleto_C: string | null;
  tic_FechaModificacion: string | null;
  usu_UsuarioModificacion: number | null;
  nombreCompleto_M: string | null;
  tic_FechaEliminacion: string | null;
  usu_UsuarioEliminacion: number | null;
  nombreCompleto_E: string | null;
}

export interface Personnel {
  id: string;
  name: string;
  email: string;
  phone: string;
  areaId: string;
  areaName: string;
  position: string;
  isActive: boolean;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  roleId: string;
  roleName: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}