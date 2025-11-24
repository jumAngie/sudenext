import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Student, StaffMember, UserRole } from '../types';
import { loginStudentAPI } from "../services/authService";
import { loginStaffAPI } from "../services/authService";

interface AuthContextType {
  user: User | null;
  login: (credentials: { identifier: string; password: string; type: 'student' | 'staff' }) => Promise<boolean>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapRoleToUserRole = (rol_Descripcion: string): UserRole => {
  const key = rol_Descripcion.toLowerCase();

  if (key.includes("admin")) return "administrador";
  if (key.includes("odonto")) return "odontologo";
  if (key.includes("medico")) return "medico_general";
  if (key.includes("asesor")) return "asesor_academico";
  if (key.includes("consej")) return "consejero";

  return "administrador"; // fallback
};

// Mock data - Estudiantes reales del sistema
const mockStudents: Student[] = [
  {
    id: 'student-1',
    accountNumber: '20222000215',
    name: 'Angie Y. Campos Arias',
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
    const savedUser = localStorage.getItem('sudenext-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: { identifier: string; password: string; type: 'student' | 'staff' }) => {
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 300));
    // student
    if (credentials.type === "student") {
      const response = await loginStudentAPI(credentials.identifier, credentials.password);
      if (response.success) {
        const studentData = response.student;
        const userData: User = {
          type: "student",
          data: {
            id: studentData.est_ID, 
            accountNumber: studentData.est_NumeroCuenta,
            name: studentData.est_NombreCompleto,
            email: studentData.est_Correo,
            phone: studentData.est_Celular,
            career: studentData.est_Carrera,
            status: studentData.est_EstadoM,
          },
        };
        setUser(userData);
        localStorage.setItem("sudenext-user", JSON.stringify(userData));
        setIsLoading(false);
        return {
          success: true,
          message: "Inicio de sesión exitoso",
        };
      }
      setIsLoading(false);
      return {
        success: false,
        message: response.message
      };
    }
    // staff
    if (credentials.type === "staff") {
      const response = await loginStaffAPI(credentials.identifier, credentials.password);
      if (!response.success) {
        setIsLoading(false);
        return {
          success: false,
          message: response.message
        };
      }
      const s = response.staff;
      console.log(response.staff);
      const userData: User = {
        type: "staff",
        data: {
          id: s.usu_ID.toString(),
          personalId: s.per_ID,
          email: s.per_Correo,
          name: `${s.per_Nombres} ${s.per_Apellidos}`,
          role: mapRoleToUserRole(s.rol_Descripcion),
          department: s.are_Nombre
        }
      };
      setUser(userData);
      localStorage.setItem("sudenext-user", JSON.stringify(userData));
      setIsLoading(false);
      return {
        success: true,
        message: response.message
      };
    }
  }



  const logout = () => {
    setUser(null);
    localStorage.removeItem('sudenext-user');
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (user) {
      if (currentPassword === '12345') {
        // Update password in mock data
        if (user.type === 'student') {
          const studentIndex = mockStudents.findIndex(s => s.accountNumber === user.data.accountNumber);
          if (studentIndex !== -1) {
            mockStudents[studentIndex].password = newPassword;
          }
        } else {
          const staffIndex = mockStaff.findIndex(s => s.email === user.data.email);
          if (staffIndex !== -1) {
            mockStaff[staffIndex].password = newPassword;
          }
        }
        setIsLoading(false);
        return true;
      }
    }

    setIsLoading(false);
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, changePassword, isLoading }}>
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