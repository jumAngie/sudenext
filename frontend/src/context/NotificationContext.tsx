import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useData } from './DataContext';

export interface Notification {
  id: string;
  type: 'support_session' | 'dental_appointment' | 'academic_consultation' | 'medical_checkin';
  title: string;
  message: string;
  status: 'accepted' | 'rejected' | 'completed' | 'scheduled';
  relatedId: string;
  createdAt: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { supportSessions, dentalAppointments, academicConsultations, medicalCheckIns } = useData();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Generate notifications based on data changes
  useEffect(() => {
    if (user?.type !== 'student') return;

    const studentId = user.data.id;
    const newNotifications: Notification[] = [];

    // Support sessions notifications
    supportSessions
      .filter(session => session.studentId === studentId)
      .forEach(session => {
        if (session.status === 'asignada' && session.assignedCounselorName) {
          newNotifications.push({
            id: `support-${session.id}`,
            type: 'support_session',
            title: 'Sesión de Apoyo Asignada',
            message: `Tu sesión de apoyo psicológico ha sido asignada a ${session.assignedCounselorName}`,
            status: 'accepted',
            relatedId: session.id,
            createdAt: session.createdAt,
            read: false
          });
        } else if (session.status === 'completada') {
          newNotifications.push({
            id: `support-completed-${session.id}`,
            type: 'support_session',
            title: 'Sesión de Apoyo Completada',
            message: 'Tu sesión de apoyo psicológico ha sido completada exitosamente',
            status: 'completed',
            relatedId: session.id,
            createdAt: session.createdAt,
            read: false
          });
        }
      });

    // Dental appointments notifications
    dentalAppointments
      .filter(appointment => appointment.studentId === studentId)
      .forEach(appointment => {
        if (appointment.status === 'confirmada' && appointment.assignedDentistName) {
          newNotifications.push({
            id: `dental-${appointment.id}`,
            type: 'dental_appointment',
            title: 'Cita Odontológica Confirmada',
            message: `Tu cita odontológica ha sido confirmada con ${appointment.assignedDentistName}`,
            status: 'accepted',
            relatedId: appointment.id,
            createdAt: appointment.createdAt,
            read: false
          });
        } else if (appointment.status === 'rechazada') {
          newNotifications.push({
            id: `dental-rejected-${appointment.id}`,
            type: 'dental_appointment',
            title: 'Cita Odontológica Rechazada',
            message: 'Tu solicitud de cita odontológica ha sido rechazada. Por favor, contacta al departamento.',
            status: 'rejected',
            relatedId: appointment.id,
            createdAt: appointment.createdAt,
            read: false
          });
        }
      });

    // Academic consultations notifications
    academicConsultations
      .filter(consultation => consultation.studentId === studentId)
      .forEach(consultation => {
        if (consultation.status === 'completada') {
          newNotifications.push({
            id: `academic-${consultation.id}`,
            type: 'academic_consultation',
            title: 'Consulta Académica Completada',
            message: `Tu consulta académica con ${consultation.advisorName} ha sido completada`,
            status: 'completed',
            relatedId: consultation.id,
            createdAt: consultation.createdAt,
            read: false
          });
        }
      });

    // Medical check-ins notifications
    medicalCheckIns
      .filter(checkIn => checkIn.studentId === studentId)
      .forEach(checkIn => {
        if (checkIn.attended) {
          newNotifications.push({
            id: `medical-${checkIn.id}`,
            type: 'medical_checkin',
            title: 'Revisión Médica Completada',
            message: 'Tu revisión médica ha sido completada exitosamente',
            status: 'completed',
            relatedId: checkIn.id,
            createdAt: checkIn.createdAt,
            read: false
          });
        }
      });

    // Load existing notifications from localStorage
    const savedNotifications = localStorage.getItem(`notifications-${studentId}`);
    const existingNotifications = savedNotifications ? JSON.parse(savedNotifications) : [];

    // Merge new notifications with existing ones, avoiding duplicates
    const allNotifications = [...existingNotifications];
    newNotifications.forEach(newNotif => {
      if (!allNotifications.find(existing => existing.id === newNotif.id)) {
        allNotifications.push(newNotif);
      }
    });

    // Sort by creation date (newest first)
    allNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setNotifications(allNotifications);
  }, [user, supportSessions, dentalAppointments, academicConsultations, medicalCheckIns]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (user?.type === 'student') {
      localStorage.setItem(`notifications-${user.data.id}`, JSON.stringify(notifications));
    }
  }, [notifications, user]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      addNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}