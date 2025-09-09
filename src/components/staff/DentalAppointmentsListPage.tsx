import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { useData } from '../../context/DataContext';
import { DentalAppointment } from '../../types';
import { 
  Stethoscope, Search, Filter, Eye, Calendar, User, 
  Clock, AlertTriangle, Users, CheckCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function DentalAppointmentsListPage() {
  const { dentalAppointments } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dentistFilter, setDentistFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState<DentalAppointment | null>(null);

  // Get unique dentists for filter
  const uniqueDentists = Array.from(
    new Set(
      dentalAppointments
        .filter(appointment => appointment.assignedDentistName)
        .map(appointment => appointment.assignedDentistName)
    )
  );

  // Filter appointments based on search and filters
  const filteredAppointments = dentalAppointments.filter(appointment => {
    const matchesSearch = 
      appointment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.accountNumber.includes(searchTerm) ||
      appointment.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || appointment.priority === priorityFilter;
    const matchesDentist = dentistFilter === 'all' || appointment.assignedDentistName === dentistFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesDentist;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-HN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baja': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'alta': return <AlertTriangle className="w-3 h-3 text-red-600" />;
      case 'media': return <Clock className="w-3 h-3 text-yellow-600" />;
      case 'baja': return <CheckCircle className="w-3 h-3 text-green-600" />;
      default: return <div className="w-3 h-3" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pendiente': 'bg-yellow-100 text-yellow-800',
      'confirmada': 'bg-blue-100 text-blue-800',
      'completada': 'bg-green-100 text-green-800',
      'cancelada': 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  const handleViewAppointment = (appointment: DentalAppointment) => {
    setSelectedAppointment(appointment);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setDentistFilter('all');
    toast.success('Filtros limpiados');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-[#edba0d]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#004aad]">
            <Stethoscope className="w-5 h-5" />
            Listado de Citas Odontológicas
          </CardTitle>
          <CardDescription>
            Vista completa de todas las citas odontológicas registradas en el sistema
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Citas</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dentalAppointments.length}</div>
            <p className="text-xs text-muted-foreground">Registradas en el sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dentalAppointments.filter(a => a.status === 'pendiente').length}
            </div>
            <p className="text-xs text-muted-foreground">Esperando asignación</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dentalAppointments.filter(a => a.status === 'confirmada').length}
            </div>
            <p className="text-xs text-muted-foreground">Con odontólogo asignado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dentalAppointments.filter(a => a.status === 'completada').length}
            </div>
            <p className="text-xs text-muted-foreground">Finalizadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nombre, cuenta o motivo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="confirmada">Confirmada</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Prioridad</label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las prioridades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las prioridades</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Odontólogo</label>
              <Select value={dentistFilter} onValueChange={setDentistFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los odontólogos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los odontólogos</SelectItem>
                  {uniqueDentists.map((dentist) => (
                    <SelectItem key={dentist} value={dentist}>
                      {dentist}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="w-full"
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Citas Odontológicas ({filteredAppointments.length} de {dentalAppointments.length})
          </CardTitle>
          <CardDescription>
            Lista completa de todas las citas odontológicas registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron citas con los filtros aplicados</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>No. Cuenta</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Odontólogo Asignado</TableHead>
                  <TableHead>Fecha Preferida</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Fecha Solicitud</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {appointment.studentName}
                    </TableCell>
                    <TableCell className="font-mono">
                      {appointment.accountNumber}
                    </TableCell>
                    <TableCell className="max-w-48">
                      <p className="truncate" title={appointment.reason}>
                        {appointment.reason}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getPriorityIcon(appointment.priority)}
                        <Badge className={getPriorityColor(appointment.priority)}>
                          {appointment.priority.toUpperCase()}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {appointment.assignedDentistName ? (
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-yellow-600" />
                          <span className="text-yellow-600 font-medium">
                            {appointment.assignedDentistName}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Sin asignar</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {appointment.preferredDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {appointment.preferredTime}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(appointment.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(appointment.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewAppointment(appointment)}
                        className="text-[#edba0d] border-[#edba0d] hover:bg-[#edba0d] hover:text-white"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Appointment Details Modal */}
      <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#edba0d]" />
              Detalles de la Cita Odontológica
            </DialogTitle>
            <DialogDescription>
              Información completa de la cita seleccionada
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-6">
              {/* Patient Information */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-[#004aad] mb-3">Información del Paciente</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Nombre:</span>
                    <p className="font-medium">{selectedAppointment.studentName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">No. Cuenta:</span>
                    <p className="font-medium">{selectedAppointment.accountNumber}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Prioridad:</span>
                    <div className="flex items-center gap-1 mt-1">
                      {getPriorityIcon(selectedAppointment.priority)}
                      <Badge className={getPriorityColor(selectedAppointment.priority)}>
                        {selectedAppointment.priority.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Fecha Preferida:</span>
                    <p className="font-medium">{selectedAppointment.preferredDate}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Hora Preferida:</span>
                    <p className="font-medium">{selectedAppointment.preferredTime}</p>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Motivo de la Consulta</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {selectedAppointment.reason}
                  </p>
                </div>
              </div>

              {/* Assignment Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Información de Asignación</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Estado:</span>
                    <div className="mt-1">{getStatusBadge(selectedAppointment.status)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Odontólogo Asignado:</span>
                    <p className="font-medium">
                      {selectedAppointment.assignedDentistName || 'Sin asignar'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Fecha de Solicitud:</span>
                    <p className="font-medium">{formatDate(selectedAppointment.createdAt)}</p>
                  </div>
                  {selectedAppointment.confirmedAt && (
                    <div>
                      <span className="text-gray-600">Fecha de Confirmación:</span>
                      <p className="font-medium">{formatDate(selectedAppointment.confirmedAt)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t">
                <Button 
                  onClick={() => setSelectedAppointment(null)}
                  className="bg-[#edba0d] hover:bg-[#d4a40b] text-white"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}