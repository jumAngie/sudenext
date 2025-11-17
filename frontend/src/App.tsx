import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { LandingPage } from './components/LandingPage';
import { LoginForm } from './components/LoginForm';
import { StudentDashboard } from './components/student/StudentDashboard';
import { StaffLayout } from './components/staff/StaffLayout';
import { StaffDashboard } from './components/staff/StaffDashboard';
import { AssignCounselorPage } from './components/staff/AssignCounselorPage';
import { ActionPlansPage } from './components/staff/ActionPlansPage';
import { MedicalCheckInPage } from './components/staff/MedicalCheckInPage';
import { AcademicConsultationsPage } from './components/staff/AcademicConsultationsPage';
import { AssignDentalPage } from './components/staff/AssignDentalPage';
import { DownloadReportsPage } from './components/staff/DownloadReportsPage';
import { SupportSessionsListPage } from './components/staff/SupportSessionsListPage';
import { DentalAppointmentsListPage } from './components/staff/DentalAppointmentsListPage';
import { DentalTreatmentPage } from './components/staff/DentalTreatmentPage';
import { MedicalCheckInsListPage } from './components/staff/MedicalCheckInsListPage';
import { AcademicConsultationsListPage } from './components/staff/AcademicConsultationsListPage';
import { AreasPage } from './components/staff/AreasPage';
import { PersonnelPage } from './components/staff/PersonnelPage';
import { RolesPage } from './components/staff/RolesPage';
import { UsersPage } from './components/staff/UsersPage';
import { ConsultationTypesPage } from './components/staff/ConsultationTypesPage';
import { TreatmentTypesPage } from './components/staff/TreatmentTypesPage';
import { ProfilePage } from './components/staff/ProfilePage';
import { NotificationProvider } from './context/NotificationContext';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentStaffPage, setCurrentStaffPage] = useState('dashboard');
  const [showLogin, setShowLogin] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#004aad] to-[#edba0d]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user && !showLogin) {
    return <LandingPage onLoginClick={() => setShowLogin(true)} />;
  }

  if (!user && showLogin) {
    return <LoginForm onBackToLanding={() => setShowLogin(false)} />;
  }

  if (user?.type === 'student') {
    return <StudentDashboard />;
  }

  // Staff Dashboard with different pages (simplified routing)
  const renderStaffPage = () => {
    switch (currentStaffPage) {
      case 'dashboard':
        return <StaffDashboard />;
      
      // Psychology Module
      case 'support-sessions-list':
        return <SupportSessionsListPage />;
      case 'assign-counselor':
        return <AssignCounselorPage />;
      case 'action-plans':
        return <ActionPlansPage />;
      
      // Dentistry Module
      case 'dental-appointments-list':
        return <DentalAppointmentsListPage />;
      case 'dental-treatment':
        return <DentalTreatmentPage />;
      case 'assign-dental':
        return <AssignDentalPage />;
      
      // Medicine Module
      case 'medical-checkins-list':
        return <MedicalCheckInsListPage />;
      case 'medical-checkin':
        return <MedicalCheckInPage />;
      
      // Academic Module
      case 'academic-consultations-list':
        return <AcademicConsultationsListPage />;
      case 'academic-consultations':
        return <AcademicConsultationsPage />;
      case 'consultation-types':
        return <ConsultationTypesPage />;
      
      // Dentistry - Treatment Types
      case 'treatment-types':
        return <TreatmentTypesPage />;
      
      // General Section
      case 'areas':
        return <AreasPage />;
      case 'personnel':
        return <PersonnelPage />;
      
      // Access Section
      case 'roles':
        return <RolesPage />;
      case 'users':
        return <UsersPage />;
      
      // Reports
      case 'download-reports':
        return <DownloadReportsPage />;
      
      // Profile
      case 'profile':
        return <ProfilePage />;
      
      default:
        return <StaffDashboard />;
    }
  };

  return (
    <StaffLayout
      currentPage={currentStaffPage}
      onPageChange={setCurrentStaffPage}
    >
      {renderStaffPage()}
    </StaffLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <NotificationProvider>
          <AppContent />
          <Toaster position="top-right" />
        </NotificationProvider>
      </DataProvider>
    </AuthProvider>
  );
}