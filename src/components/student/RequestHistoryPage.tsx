import React, { useState, useMemo } from 'react';
import { Search, Filter, Calendar, FileText, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { formatDate, formatDateTime } from '../../utils/dateHelpers';
import { getStatusColor, getStatusIcon, getStatusText } from '../../utils/statusHelpers';

type RequestType = 'all' | 'support_session' | 'dental_appointment' | 'academic_consultation' | 'medical_checkin';
type RequestStatus = 'all' | 'pendiente' | 'asignada' | 'confirmada' | 'completada' | 'rechazada';

interface RequestItem {
  id: string;
  type: RequestType;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  completedAt?: string;
  assignedTo?: string;
  priority?: string;
}

export function RequestHistoryPage() {
  const { user } = useAuth();
  const { supportSessions, dentalAppointments, academicConsultations, medicalCheckIns } = useData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<RequestType>('all');
  const [statusFilter, setStatusFilter] = useState<RequestStatus>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'last_week' | 'last_month' | 'last_3_months'>('all');

  // Consolidate all requests for the current student
  const allRequests = useMemo((): RequestItem[] => {
    if (user?.type !== 'student') return [];
    
    const studentId = user.data.id;
    const requests: RequestItem[] = [];

    // Support Sessions
    supportSessions
      .filter(session => session.studentId === studentId)
      .forEach(session => {
        requests.push({
          id: session.id,
          type: 'support_session',
          title: 'Sesión de Apoyo Psicológico',
          description: session.mainReason.substring(0, 100) + (session.mainReason.length > 100 ? '...' : ''),
          status: session.status,
          createdAt: session.createdAt,
          assignedTo: session.assignedCounselorName
        });
      });

    // Dental Appointments
    dentalAppointments
      .filter(appointment => appointment.studentId === studentId)
      .forEach(appointment => {
        requests.push({
          id: appointment.id,
          type: 'dental_appointment',
          title: 'Cita Odontológica',
          description: appointment.reason,
          status: appointment.status,
          createdAt: appointment.createdAt,
          assignedTo: appointment.assignedDentistName,
          priority: appointment.priority
        });
      });

    // Academic Consultations
    academicConsultations
      .filter(consultation => consultation.studentId === studentId)
      .forEach(consultation => {
        requests.push({
          id: consultation.id,
          type: 'academic_consultation',
          title: 'Consulta Académica',
          description: consultation.description.substring(0, 100) + (consultation.description.length > 100 ? '...' : ''),
          status: consultation.status,
          createdAt: consultation.createdAt,
          completedAt: consultation.completedAt,
          assignedTo: consultation.advisorName
        });
      });

    // Medical Check-ins
    medicalCheckIns
      .filter(checkIn => checkIn.studentId === studentId)
      .forEach(checkIn => {
        requests.push({
          id: checkIn.id,
          type: 'medical_checkin',
          title: 'Revisión Médica',
          description: checkIn.symptoms.length > 0 ? checkIn.symptoms.join(', ') : 'Check-up de rutina',
          status: checkIn.attended ? 'completada' : 'pendiente',
          createdAt: checkIn.createdAt
        });
      });

    // Sort by creation date (newest first)
    return requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [user, supportSessions, dentalAppointments, academicConsultations, medicalCheckIns]);

  // Apply filters
  const filteredRequests = useMemo(() => {
    return allRequests.filter(request => {
      // Search filter
      if (searchTerm && !request.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !request.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Type filter
      if (typeFilter !== 'all' && request.type !== typeFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all' && request.status !== statusFilter) {
        return false;
      }

      // Date filter
      if (dateFilter !== 'all') {
        const requestDate = new Date(request.createdAt);
        const now = new Date();
        const diffTime = now.getTime() - requestDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (dateFilter) {
          case 'last_week':
            if (diffDays > 7) return false;
            break;
          case 'last_month':
            if (diffDays > 30) return false;
            break;
          case 'last_3_months':
            if (diffDays > 90) return false;
            break;
        }
      }

      return true;
    });
  }, [allRequests, searchTerm, typeFilter, statusFilter, dateFilter]);

  const getTypeLabel = (type: RequestType) => {
    switch (type) {
      case 'support_session': return 'Apoyo Psicológico';
      case 'dental_appointment': return 'Odontología';
      case 'academic_consultation': return 'Asesoría Académica';
      case 'medical_checkin': return 'Medicina General';
      default: return 'Todos';
    }
  };

  const getTypeIcon = (type: RequestType) => {
    switch (type) {
      case 'support_session': return <FileText className="h-4 w-4" />;
      case 'dental_appointment': return <Calendar className="h-4 w-4" />;
      case 'academic_consultation': return <FileText className="h-4 w-4" />;
      case 'medical_checkin': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null;
    
    const colors = {
      alta: 'bg-red-100 text-red-800',
      media: 'bg-yellow-100 text-yellow-800',
      baja: 'bg-green-100 text-green-800'
    };

    return (
      <Badge variant="secondary" className={`${colors[priority as keyof typeof colors]} text-xs`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#004aad]">Historial de Solicitudes</h1>
          <p className="text-gray-600 mt-1">
            Todas tus solicitudes de servicios estudiantiles
          </p>
        </div>
        <Badge variant="secondary" className="bg-blue-50 text-[#004aad]">
          {filteredRequests.length} solicitudes
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Buscar solicitudes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Servicio</label>
              <Select value={typeFilter} onValueChange={(value: RequestType) => setTypeFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los servicios</SelectItem>
                  <SelectItem value="support_session">Apoyo Psicológico</SelectItem>
                  <SelectItem value="dental_appointment">Odontología</SelectItem>
                  <SelectItem value="academic_consultation">Asesoría Académica</SelectItem>
                  <SelectItem value="medical_checkin">Medicina General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select value={statusFilter} onValueChange={(value: RequestStatus) => setStatusFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="asignada">Asignada</SelectItem>
                  <SelectItem value="confirmada">Confirmada</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                  <SelectItem value="rechazada">Rechazada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <Select value={dateFilter} onValueChange={(value: any) => setDateFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todo el tiempo</SelectItem>
                  <SelectItem value="last_week">Última semana</SelectItem>
                  <SelectItem value="last_month">Último mes</SelectItem>
                  <SelectItem value="last_3_months">Últimos 3 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {(searchTerm || typeFilter !== 'all' || statusFilter !== 'all' || dateFilter !== 'all') && (
            <div className="mt-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setTypeFilter('all');
                  setStatusFilter('all');
                  setDateFilter('all');
                }}
                className="text-sm"
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo de Servicio</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Asignado a</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Fecha Creación</TableHead>
                  <TableHead>Fecha Completada</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p>No se encontraron solicitudes que coincidan con los filtros</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request) => (
                    <TableRow key={request.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(request.type)}
                          <span className="font-medium">{getTypeLabel(request.type)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="font-medium text-sm">{request.title}</p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {request.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(request.status)}>
                          {getStatusIcon(request.status)}
                          {getStatusText(request.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {request.assignedTo ? (
                          <span className="text-sm">{request.assignedTo}</span>
                        ) : (
                          <span className="text-sm text-gray-400">No asignado</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {getPriorityBadge(request.priority)}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{formatDate(request.createdAt)}</span>
                      </TableCell>
                      <TableCell>
                        {request.completedAt ? (
                          <span className="text-sm">{formatDate(request.completedAt)}</span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}