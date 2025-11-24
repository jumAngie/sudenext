import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StaffMember, SupportSession } from '../../types';
import { 
  Users, Calendar as CalendarIcon, CheckCircle, Clock, 
  Heart, Stethoscope, BookOpen, TrendingUp,
  AlertCircle, Activity, Eye, User, MapPin, FileText
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { formatDateTime } from '../../utils/dateHelpers';
import { getStatusColor } from '../../utils/statusHelpers';

// Calendar Session Detail Modal Component
interface SessionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: SupportSession[];
  selectedDate: Date | null;
}

function SessionDetailModal({ isOpen, onClose, sessions, selectedDate }: SessionDetailModalProps) {
  if (!selectedDate) return null;

  const dateStr = selectedDate.toISOString().split('T')[0];
  const daySessions = sessions.filter(session => {
    if (!session.scheduledAt) return false;
    return session.scheduledAt.split('T')[0] === dateStr;
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#004aad]" />
            Sesiones del {selectedDate.toLocaleDateString('es-HN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </DialogTitle>
          <DialogDescription>
            {daySessions.length} sesión(es) programada(s) para este día
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {daySessions.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay sesiones programadas para este día</p>
            </div>
          ) : (
            daySessions.map((session) => (
              <Card key={session.id} className="border-l-4 border-l-[#004aad]">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-lg">{session.studentName}</h4>
                      <p className="text-sm text-gray-600">{session.accountNumber}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={
                        session.status === 'asignada' ? 'bg-blue-100 text-blue-800' :
                        session.status === 'completada' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {session.status === 'asignada' ? 'Programada' :
                         session.status === 'completada' ? 'Completada' : 
                         session.status}
                      </Badge>
                      <p className="text-sm text-gray-500 mt-1">
                        {session.preferredTime}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Motivo principal:</span>
                      <p className="text-sm text-gray-600">{session.mainReason}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Nivel emocional:</span>
                        <p className="text-gray-600">{session.emotionalLevel}/5</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function StaffDashboard() {
  const { user } = useAuth();
  const { supportSessions, dentalAppointments, medicalCheckIns, academicConsultations } = useData();
  const staff = user?.data as StaffMember;
  
  // Calendar state for counselor
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showSessionModal, setShowSessionModal] = useState(false);

  // Calculate stats based on role
  const getStatsForRole = () => {
    switch (staff.role) {
      case 'administrador':
        return {
          totalSupportSessions: supportSessions.length,
          pendingSupportSessions: supportSessions.filter(s => s.status === 'pendiente').length,
          totalDentalAppointments: dentalAppointments.length,
          pendingDentalAppointments: dentalAppointments.filter(a => a.status === 'pendiente').length,
          totalMedicalCheckIns: medicalCheckIns.length,
          totalAcademicConsultations: academicConsultations.length
        };
      
      case 'consejero':
        const assignedSessions = supportSessions.filter(s => s.assignedCounselorId === staff.personalId);
        return {
          assignedSessions: assignedSessions.length,
          completedSessions: assignedSessions.filter(s => s.status === 'completada').length,
          pendingSessions: assignedSessions.filter(s => s.status === 'asignada').length
        };
      
      case 'odontologo':
        console.log(dentalAppointments);
        const assignedAppointments = dentalAppointments.filter(a => a.assignedDentistId === staff.personalId);
        return {
          assignedAppointments: assignedAppointments.length,
          confirmedAppointments: assignedAppointments.filter(a => a.status === 'confirmada').length,
          completedAppointments: assignedAppointments.filter(a => a.status === 'completada').length
        };
      
      case 'medico_general':
        const todayCheckIns = medicalCheckIns.filter(c => 
          new Date(c.createdAt).toDateString() === new Date().toDateString()
        );
        return {
          todayCheckIns: todayCheckIns.length,
          attendedToday: todayCheckIns.filter(c => c.attended).length,
          totalCheckIns: medicalCheckIns.length
        };
      
      case 'asesor_academico':
        const myConsultations = academicConsultations.filter(c => c.advisorId === staff.personalId);
        return {
          totalConsultations: myConsultations.length,
          completedConsultations: myConsultations.filter(c => c.status === 'completada').length,
          pendingConsultations: myConsultations.filter(c => c.status === 'pendiente').length
        };
      
      default:
        return {};
    }
  };

  const stats = getStatsForRole();

  // Get assigned sessions for counselor calendar
  const getAssignedSessions = () => {
    return supportSessions.filter(s => s.assignedCounselorId === staff.personalId);
  };

  // Get dates with scheduled sessions for calendar
  const getSessionDates = () => {
    const assignedSessions = getAssignedSessions();
    const dates = new Set<string>();
    
    assignedSessions.forEach(session => {
      if (session.scheduledAt) {
        dates.add(session.scheduledAt.split('T')[0]);
      }
    });
    
    return Array.from(dates).map(dateStr => new Date(dateStr));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setShowSessionModal(true);
    }
  };

  // Prepare data for administrator charts
  const getAdministratorChartsData = () => {
    const supportSessionsData = [
      { name: 'Pendientes', count: supportSessions.filter(s => s.status === 'pendiente').length, color: '#fbbf24' },
      { name: 'Asignadas', count: supportSessions.filter(s => s.status === 'asignada').length, color: '#3b82f6' },
      { name: 'Completadas', count: supportSessions.filter(s => s.status === 'completada').length, color: '#10b981' },
      { name: 'Rechazadas', count: supportSessions.filter(s => s.status === 'rechazada').length, color: '#ef4444' }
    ];

    const dentalAppointmentsData = [
      { name: 'Pendientes', count: dentalAppointments.filter(a => a.status === 'pendiente').length, color: '#fbbf24' },
      { name: 'Confirmadas', count: dentalAppointments.filter(a => a.status === 'confirmada').length, color: '#3b82f6' },
      { name: 'Completadas', count: dentalAppointments.filter(a => a.status === 'completada').length, color: '#10b981' },
      { name: 'Canceladas', count: dentalAppointments.filter(a => a.status === 'cancelada').length, color: '#ef4444' }
    ];

    const emotionalLevelData = [
      { level: 'Nivel 1', count: supportSessions.filter(s => s.emotionalLevel === 1).length },
      { level: 'Nivel 2', count: supportSessions.filter(s => s.emotionalLevel === 2).length },
      { level: 'Nivel 3', count: supportSessions.filter(s => s.emotionalLevel === 3).length },
      { level: 'Nivel 4', count: supportSessions.filter(s => s.emotionalLevel === 4).length },
      { level: 'Nivel 5', count: supportSessions.filter(s => s.emotionalLevel === 5).length }
    ];

    return { supportSessionsData, dentalAppointmentsData, emotionalLevelData };
  };

  const renderDashboardContent = () => {
    switch (staff.role) {
      case 'administrador':
        const { supportSessionsData, dentalAppointmentsData, emotionalLevelData } = getAdministratorChartsData();
        const totalServices = supportSessions.length + dentalAppointments.length + medicalCheckIns.length + academicConsultations.length;

        return (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Servicios</CardTitle>
                  <Activity className="h-4 w-4 text-[#004aad]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalServices}</div>
                  <p className="text-xs text-muted-foreground">Servicios registrados</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sesiones de Apoyo</CardTitle>
                  <Heart className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalSupportSessions}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.pendingSupportSessions} pendientes
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Citas Odontológicas</CardTitle>
                  <Stethoscope className="h-4 w-4 text-[#edba0d]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalDentalAppointments}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.pendingDentalAppointments} pendientes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Consultas Académicas</CardTitle>
                  <BookOpen className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalAcademicConsultations}</div>
                  <p className="text-xs text-muted-foreground">Total realizadas</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Support Sessions Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Estado de Sesiones de Apoyo</CardTitle>
                  <CardDescription>Distribución por estado de las sesiones psicológicas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={supportSessionsData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ name, count }) => `${name}: ${count}`}
                      >
                        {supportSessionsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Dental Appointments Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Estado de Citas Odontológicas</CardTitle>
                  <CardDescription>Distribución por estado de las citas dentales</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dentalAppointmentsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#edba0d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Emotional Level Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Niveles Emocionales</CardTitle>
                  <CardDescription>
                    Niveles de malestar emocional reportados en sesiones de apoyo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={emotionalLevelData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="level" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#004aad" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                  <CardDescription>
                    Últimos servicios registrados en el sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-72 overflow-y-auto">
                    {/* Support Sessions */}
                    {supportSessions.slice(0, 3).map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-red-600" />
                          <div>
                            <p className="text-sm font-medium">{session.studentName}</p>
                            <p className="text-xs text-gray-600">Sesión de apoyo</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(session.status)}>
                            {session.status}
                          </Badge>
                          <p className="text-xs text-gray-500">
                            {formatDateTime(session.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Dental Appointments */}
                    {dentalAppointments.slice(0, 2).map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-4 h-4 text-[#edba0d]" />
                          <div>
                            <p className="text-sm font-medium">{appointment.studentName}</p>
                            <p className="text-xs text-gray-600">Cita odontológica</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                          <p className="text-xs text-gray-500">
                            {formatDateTime(appointment.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Academic Consultations */}
                    {academicConsultations.slice(0, 2).map((consultation) => (
                      <div key={consultation.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-purple-600" />
                          <div>
                            <p className="text-sm font-medium">{consultation.studentName}</p>
                            <p className="text-xs text-gray-600">Consulta académica</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(consultation.status)}>
                            {consultation.status}
                          </Badge>
                          <p className="text-xs text-gray-500">
                            {formatDateTime(consultation.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Resumen Mensual</CardTitle>
                  <CardDescription>
                    Servicios registrados en el mes actual
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sesiones de Apoyo</span>
                      <Badge variant="outline">
                        {supportSessions.filter(s => {
                          const date = new Date(s.createdAt);
                          const now = new Date();
                          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                        }).length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Citas Odontológicas</span>
                      <Badge variant="outline">
                        {dentalAppointments.filter(a => {
                          const date = new Date(a.createdAt);
                          const now = new Date();
                          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                        }).length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Check-ins Médicos</span>
                      <Badge variant="outline">{medicalCheckIns.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Consultas Académicas</span>
                      <Badge variant="outline">{academicConsultations.length}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Service Priority */}
              <Card>
                <CardHeader>
                  <CardTitle>Prioridad de Servicios</CardTitle>
                  <CardDescription>
                    Distribución por nivel de prioridad
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Prioridad Alta</span>
                      <Badge className="bg-red-100 text-red-800">
                        {dentalAppointments.filter(a => a.priority === 'alta').length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Prioridad Media</span>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {dentalAppointments.filter(a => a.priority === 'media').length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Prioridad Baja</span>
                      <Badge className="bg-green-100 text-green-800">
                        {dentalAppointments.filter(a => a.priority === 'baja').length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Nivel Emocional Alto (4-5)</span>
                      <Badge className="bg-red-100 text-red-800">
                        {supportSessions.filter(s => s.emotionalLevel >= 4).length}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'consejero':
        const assignedSessions = getAssignedSessions();
        const sessionDates = getSessionDates();
        
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sesiones Asignadas</CardTitle>
                  <CalendarIcon className="h-4 w-4 text-[#004aad]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.assignedSessions}</div>
                  <p className="text-xs text-muted-foreground">Total asignadas</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingSessions}</div>
                  <p className="text-xs text-muted-foreground">Por realizar</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completadas</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.completedSessions}</div>
                  <p className="text-xs text-muted-foreground">Finalizadas</p>
                </CardContent>
              </Card>
            </div>

            {/* Calendar Section - Now Full Width */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-[#004aad]" />
                  Calendario de Sesiones Programadas
                </CardTitle>
                <CardDescription>
                  Haz clic en una fecha destacada para ver las sesiones programadas. Las fechas en azul tienen sesiones asignadas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div className="w-full max-w-md">
                    <Calendar
                      mode="single"
                      selected={selectedDate || undefined}
                      onSelect={handleDateSelect}
                      className="rounded-md border w-full [&_table]:w-full [&_td]:h-12 [&_th]:h-12 [&_button]:h-10 [&_button]:w-10 text-base"
                      modifiers={{
                        scheduled: sessionDates
                      }}
                      modifiersStyles={{
                        scheduled: {
                          backgroundColor: '#004aad',
                          color: 'white',
                          fontWeight: 'bold',
                          borderRadius: '6px'
                        }
                      }}
                    />
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 bg-[#004aad] rounded"></div>
                      <span className="font-medium text-blue-800">Fechas con sesiones programadas</span>
                    </div>
                    <p className="text-sm text-blue-600">
                      {sessionDates.length} fecha(s) con sesiones este mes
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarIcon className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-800">Próxima sesión</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {sessionDates.length > 0 
                        ? sessionDates.sort((a, b) => a.getTime() - b.getTime())[0].toLocaleDateString('es-HN')
                        : 'No hay sesiones programadas'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Sessions - Now Below Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-600" />
                  Sesiones Asignadas Recientes
                </CardTitle>
                <CardDescription>
                  Últimas sesiones asignadas a ti con detalles importantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {assignedSessions.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No tienes sesiones asignadas</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {assignedSessions.slice(0, 6).map((session) => (
                      <div key={session.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-base">{session.studentName}</h4>
                            <p className="text-sm text-gray-600">{session.accountNumber}</p>
                          </div>
                          <Badge className={
                            session.status === 'asignada' ? 'bg-blue-100 text-blue-800' :
                            session.status === 'completada' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {session.status === 'asignada' ? 'Programada' : session.status}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                          {session.mainReason}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {session.preferredTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {session.modality}
                          </span>
                          {session.scheduledAt && (
                            <span className="flex items-center gap-1 font-medium text-blue-600">
                              <CalendarIcon className="w-3 h-3" />
                              {new Date(session.scheduledAt).toLocaleDateString('es-HN')}
                            </span>
                          )}
                        </div>

                        <div className="mt-2 pt-2 border-t">
                          <span className="text-xs text-gray-500">
                            Nivel emocional: <span className="font-medium">{session.emotionalLevel}/5</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'odontologo':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Citas Asignadas</CardTitle>
                  <CalendarIcon className="h-4 w-4 text-[#edba0d]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.assignedAppointments}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.confirmedAppointments}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completadas</CardTitle>
                  <Activity className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.completedAppointments}</div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'medico_general':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Check-ins Hoy</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.todayCheckIns}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Atendidos Hoy</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.attendedToday}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Check-ins</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCheckIns}</div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'asesor_academico':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Consultas Totales</CardTitle>
                  <BookOpen className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalConsultations}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingConsultations}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completadas</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.completedConsultations}</div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return <div>Dashboard content</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="border-l-4 border-l-[#004aad]">
        <CardHeader>
          <CardTitle className="text-[#004aad]">
            Bienvenido(a), {staff.name}
          </CardTitle>
          <CardDescription>
            {staff.department} - {staff.role === 'administrador' ? 'Administrador' : 
             staff.role === 'consejero' ? 'Consejero/Psicólogo' :
             staff.role === 'odontologo' ? 'Odontólogo' :
             staff.role === 'medico_general' ? 'Médico General' :
             'Asesor Académico'}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Dashboard Content */}
      {renderDashboardContent()}

      {/* Session Detail Modal for Counselor */}
      {staff.role === 'consejero' && (
        <SessionDetailModal
          isOpen={showSessionModal}
          onClose={() => setShowSessionModal(false)}
          sessions={getAssignedSessions()}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
}