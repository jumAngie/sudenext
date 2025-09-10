import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useData } from '../../context/DataContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Calendar, Users, TrendingUp, FileText, 
  Heart, Stethoscope, BookOpen, Activity
} from 'lucide-react';
import { formatDateTime } from '../../utils/dateHelpers';
import { getStatusColor } from '../../utils/statusHelpers';

export function ReportsPage() {
  const { supportSessions, dentalAppointments, medicalCheckIns, academicConsultations } = useData();

  // Prepare data for charts
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

  const totalServices = supportSessions.length + dentalAppointments.length + medicalCheckIns.length + academicConsultations.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-[#004aad]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#004aad]">
            <FileText className="w-5 h-5" />
            Reportes y Estadísticas
          </CardTitle>
          <CardDescription>
            Vista general de los servicios de atención estudiantil del SUDECAD
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Summary Statistics */}
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
            <div className="text-2xl font-bold">{supportSessions.length}</div>
            <p className="text-xs text-muted-foreground">Total sesiones</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas Odontológicas</CardTitle>
            <Stethoscope className="h-4 w-4 text-[#edba0d]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dentalAppointments.length}</div>
            <p className="text-xs text-muted-foreground">Total citas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultas Académicas</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{academicConsultations.length}</div>
            <p className="text-xs text-muted-foreground">Total consultas</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Support Sessions Status */}
        <Card>
          <CardHeader>
            <CardTitle>Estado de Sesiones de Apoyo</CardTitle>
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
}