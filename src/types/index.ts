export type UserRole = 'administrador' | 'odontologo' | 'medico_general' | 'asesor_academico' | 'consejero';

export interface Student {
  id: string;
  accountNumber: string;
  name: string;
  email: string;
  phone: string;
  career: string;
}

export interface StaffMember {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department: string;
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