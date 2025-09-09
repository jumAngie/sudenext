import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  SupportSession, ActionPlan, DentalAppointment, 
  MedicalCheckIn, AcademicConsultation, DentalTreatment 
} from '../types';

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

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [supportSessions, setSupportSessions] = useState<SupportSession[]>(initialSupportSessions);
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([]);
  const [dentalAppointments, setDentalAppointments] = useState<DentalAppointment[]>(initialDentalAppointments);
  const [dentalTreatments, setDentalTreatments] = useState<DentalTreatment[]>(initialDentalTreatments);
  const [medicalCheckIns, setMedicalCheckIns] = useState<MedicalCheckIn[]>(initialMedicalCheckIns);
  const [academicConsultations, setAcademicConsultations] = useState<AcademicConsultation[]>(initialAcademicConsultations);

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
      updateAcademicConsultation
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