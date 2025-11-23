import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { NotificationProvider } from "../../context/NotificationContext";
import { Student } from "../../types";
import {
  Calendar,
  Clock,
  MessageSquare,
  Stethoscope,
  GraduationCap,
  Plus,
  LogOut,
  User,
  Phone,
  Mail,
  Heart,
  Eye,
  Edit,
  Trash2,
  History,
  Home,
} from "lucide-react";
import { SupportSessionModal } from "./SupportSessionModal";
import { DentalAppointmentModal } from "./DentalAppointmentModal";
import { RequestDetailsModal } from "./RequestDetailsModal";
import { NotificationDropdown } from "./NotificationDropdown";
import { RequestHistoryPage } from "./RequestHistoryPage";
import { getStatusColor } from "../../utils/statusHelpers";
import { formatDateTime } from "../../utils/dateHelpers";
import logoSudenext from "figma:asset/fbac00c7ee6746f5326012d41ba2b03e7a9e7f11.png";
import logoSudecad from "figma:asset/22cd37652b59616ba81f702b45c65f8b7ad8d496.png";

function StudentDashboardContent() {
  const { user, logout } = useAuth();
  const { supportSessions, dentalAppointments } = useData();
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showDentalModal, setShowDentalModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [requestType, setRequestType] = useState<"support" | "dental">("support");
  const [activeTab, setActiveTab] = useState("inicio");

  const student = user?.data as Student;

  // Get student's recent requests (limit to 3 most recent for each type)
  const studentSupportSessions = supportSessions
    .filter((s) => s.studentId === student.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

    console.log(studentSupportSessions);
    
  const studentDentalAppointments = dentalAppointments
    .filter((a) => a.studentId === student.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const handleViewDetails = (request: any, type: "support" | "dental") => {
    setSelectedRequest(request);
    setRequestType(type);
    setShowDetailsModal(true);
  };

  const getActionButtons = (request: any, type: "support" | "dental") => {
    const canEdit = request.status === "pendiente";
    const canCancel =
      request.status === "pendiente" ||
      request.status === "asignada" ||
      request.status === "confirmada";

    return (
      <div className="flex gap-2 mt-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleViewDetails(request, type)}
          className="text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          <Eye className="w-3 h-3 mr-1" />
          Ver
        </Button>
        {canEdit && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleViewDetails(request, type)}
            className="text-green-600 border-green-200 hover:bg-green-50"
          >
            <Edit className="w-3 h-3 mr-1" />
            Editar
          </Button>
        )}
        {canCancel && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleViewDetails(request, type)}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Cancelar
          </Button>
        )}
      </div>
    );
  };

  const renderHomeContent = () => (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="border-l-4 border-l-[#edba0d]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#004aad]">
            <User className="w-5 h-5" />
            Bienvenido, {student.name}
          </CardTitle>
          <CardDescription>
            Accede a los servicios de atención estudiantil del SUDECAD
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#004aad]" />
            <div>
              <p className="text-sm text-gray-600">Carrera</p>
              <p className="font-medium">{student.career}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#004aad]" />
            <div>
              <p className="text-sm text-gray-600">Teléfono</p>
              <p className="font-medium">{student.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#004aad]" />
            <div>
              <p className="text-sm text-gray-600">Correo</p>
              <p className="font-medium">{student.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#004aad]">
              <Heart className="w-5 h-5" />
              Sesiones de Apoyo Psicológico
            </CardTitle>
            <CardDescription>
              Solicita apoyo psicopedagógico para mejorar tu bienestar emocional
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setShowSupportModal(true)}
              className="w-full bg-[#004aad] hover:bg-[#003687] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Solicitar Sesión de Apoyo
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#004aad]">
              <Stethoscope className="w-5 h-5" />
              Citas Odontológicas
            </CardTitle>
            <CardDescription>
              Agenda tu cita odontológica para mantener tu salud dental
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setShowDentalModal(true)}
              className="w-full bg-[#edba0d] hover:bg-[#d4a40b] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agendar Cita Odontológica
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Support Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#004aad]" />
                Sesiones de Apoyo Recientes
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("historial")}
                className="text-[#004aad] hover:bg-blue-50"
              >
                Ver todas
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {studentSupportSessions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No tienes sesiones de apoyo registradas
              </p>
            ) : (
              <div className="space-y-3">
                {studentSupportSessions.map((session) => (
                  <div
                    key={session.id}
                    className="border rounded-lg p-3 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={getStatusColor(session.status)}>
                        {session.status.charAt(0).toUpperCase() +
                          session.status.slice(1)}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {formatDateTime(session.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-1">
                      {session.mainReason.substring(0, 50)}...
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {session.preferredTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {session.modality}
                      </span>
                    </div>
                    {session.assignedCounselorName && (
                      <p className="text-xs text-blue-600 mb-2">
                        Asignado a: {session.assignedCounselorName}
                      </p>
                    )}
                    {getActionButtons(session, "support")}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Dental Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-[#004aad]" />
                Citas Odontológicas Recientes
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("historial")}
                className="text-[#004aad] hover:bg-blue-50"
              >
                Ver todas
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {studentDentalAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No tienes citas odontológicas registradas
              </p>
            ) : (
              <div className="space-y-3">
                {studentDentalAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border rounded-lg p-3 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status.charAt(0).toUpperCase() +
                          appointment.status.slice(1)}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {formatDateTime(appointment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-1">
                      {appointment.reason}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {appointment.preferredDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {appointment.preferredTime}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {appointment.priority}
                      </Badge>
                    </div>
                    {appointment.assignedDentistName && (
                      <p className="text-xs text-blue-600 mb-2">
                        Asignado a: {appointment.assignedDentistName}
                      </p>
                    )}
                    {getActionButtons(appointment, "dental")}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#004aad] text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src={logoSudenext} alt="SUDENEXT" className="h-10" />
            <div>
              <h1 className="text-xl font-bold">
                SUDENEXT - Portal Estudiantil
              </h1>
              <p className="text-sm opacity-90">
                Universidad Nacional Autónoma de Honduras - Campus Cortés
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <NotificationDropdown />
            
            <div className="text-right">
              <p className="font-medium">{student.name}</p>
              <p className="text-sm opacity-90">{student.accountNumber}</p>
            </div>
            <Button
              variant="outline"
              className="justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              onClick={logout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="inicio" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Inicio
            </TabsTrigger>
            <TabsTrigger value="historial" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Historial de Solicitudes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inicio" className="space-y-6">
            {renderHomeContent()}
          </TabsContent>

          <TabsContent value="historial" className="space-y-6">
            <RequestHistoryPage />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-2">
            <img src={logoSudecad} alt="SUDECAD" className="h-8" />
          </div>
          <p className="text-sm text-gray-600">
            SUDECAD - Subdirección de Desarrollo Estudiantil, Cultura, Arte y
            Deporte
          </p>
        </div>
      </div>

      {/* Modals */}
      <SupportSessionModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />
      <DentalAppointmentModal
        isOpen={showDentalModal}
        onClose={() => setShowDentalModal(false)}
      />
      <RequestDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        request={selectedRequest}
        type={requestType}
      />
    </div>
  );
}

export function StudentDashboard() {
  return (
    <NotificationProvider>
      <StudentDashboardContent />
    </NotificationProvider>
  );
}