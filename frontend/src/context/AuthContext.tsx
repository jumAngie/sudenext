import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Student, StaffMember, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (credentials: { identifier: string; password: string; type: 'student' | 'staff' }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data - Estudiantes reales del sistema
const mockStudents: Student[] = [
  {
    id: 'student-1',
    accountNumber: '20222000215',
    name: 'Angie Yahaira Campos Arias',
    email: 'angie.campos@unah.hn',
    phone: '9999-8888',
    career: 'Informática Administrativa'
  },
  {
    id: 'student-2',
    accountNumber: '20222000224',
    name: 'Cindy Nicole Reyes Arevalo',
    email: 'cindy.reyes@unah.hn',
    phone: '9999-7777',
    career: 'Informática Administrativa'
  },
  {
    id: 'student-3',
    accountNumber: '20210001123',
    name: 'Elmer Isai Alvarez Carbajal',
    email: 'elmer.alvarez@unah.hn',
    phone: '9999-6666',
    career: 'Informática Administrativa'
  },
  {
    id: 'student-4',
    accountNumber: '20240128910',
    name: 'Juan David Molina Sagastume',
    email: 'juan.molina@unah.hn',
    phone: '9999-5555',
    career: 'Ingeniería en Sistemas'
  },
  {
    id: 'student-5',
    accountNumber: '20222000120',
    name: 'Luis Mario Aguilera Valle',
    email: 'luis.aguilera@unah.hn',
    phone: '9999-4444',
    career: 'Enfermería'
  },
  {
    id: 'student-6',
    accountNumber: '20222000123',
    name: 'Nathaly Valeria Durán Castillo',
    email: 'nathaly.duran@unah.hn',
    phone: '9999-3333',
    career: 'Informática Administrativa'
  },
  {
    id: 'student-7',
    accountNumber: '20222000125',
    name: 'Gerson David Franco Lobo',
    email: 'gerson.franco@unah.hn',
    phone: '9999-2222',
    career: 'Filosofía'
  },
  {
    id: 'student-8',
    accountNumber: '20222000187',
    name: 'Jasser Evelio George Martinez',
    email: 'jasser.george@unah.hn',
    phone: '9999-1111',
    career: 'Ingeniería Espacial'
  },
  {
    id: 'student-9',
    accountNumber: '20222000200',
    name: 'Mario Deniel Hernandez',
    email: 'mario.hernandez@unah.hn',
    phone: '9999-0000',
    career: 'Contaduría Pública y Finanzas'
  },
  {
    id: 'student-10',
    accountNumber: '20222001203',
    name: 'Miriam Alicia Rojas',
    email: 'miriam.rojas@unah.hn',
    phone: '9998-9999',
    career: 'Pedagogía'
  },
  {
    id: 'student-11',
    accountNumber: '20222000389',
    name: 'Dennis Antonio Peña Hernandez',
    email: 'dennis.pena@unah.hn',
    phone: '9998-8888',
    career: 'Informática Administrativa'
  }
];

const mockStaff: StaffMember[] = [
  {
    id: 'staff-1',
    email: 'admin@unah.hn',
    name: 'Carmen Eugenia Salgado',
    role: 'administrador',
    department: 'SUDECAD'
  },
  {
    id: 'staff-2',
    email: 'odontologo@unah.hn',
    name: 'Sherlyn Nicole Monje',
    role: 'odontologo',
    department: 'Odontología'
  },
  {
    id: 'staff-3',
    email: 'medico@unah.hn',
    name: 'Steven Eduardo Flores',
    role: 'medico_general',
    department: 'Medicina General'
  },
  {
    id: 'staff-4',
    email: 'asesor@unah.hn',
    name: 'Denis Roberto García',
    role: 'asesor_academico',
    department: 'Asesoría Académica'
  },
  {
    id: 'staff-5',
    email: 'psicologo@unah.hn',
    name: 'Elder Alexandro Lopez',
    role: 'consejero',
    department: 'Psicología'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('sudenext-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: { identifier: string; password: string; type: 'student' | 'staff' }): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (credentials.type === 'student') {
      const student = mockStudents.find(s => s.accountNumber === credentials.identifier);
      if (student && credentials.password === '12345') {
        const userData: User = { type: 'student', data: student };
        setUser(userData);
        localStorage.setItem('sudenext-user', JSON.stringify(userData));
        setIsLoading(false);
        return true;
      }
    } else {
      const staff = mockStaff.find(s => s.email === credentials.identifier);
      if (staff && credentials.password === '12345') {
        const userData: User = { type: 'staff', data: staff };
        setUser(userData);
        localStorage.setItem('sudenext-user', JSON.stringify(userData));
        setIsLoading(false);
        return true;
      }
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sudenext-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthContext');
  }
  return context;
}