import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useData } from '../../context/DataContext';
import { DentalAppointment } from '../../types';
import { 
  Stethoscope, Search, Filter, Eye, Calendar, User, 
  Clock, AlertTriangle, CheckCircle, ChevronDown, ChevronRight, Plus, Pencil, Trash2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// Mock dental treatments data
const mockTreatments = {
  'dent-1': [
    { id: 'treat-1', appointmentId: 'dent-1', treatmentType: 'Limpieza Dental', description: 'Limpieza profunda y pulido', cost: 300, sessions: 1, status: 'completado', createdAt: '2024-11-01' }
  ],
  'dent-2': [
    { id: 'treat-2', appointmentId: 'dent-2', treatmentType: 'Extracción', description: 'Extracción de molar', cost: 500, sessions: 1, status: 'en-progreso', createdAt: '2024-10-28' }
  ],
  'dent-3': [
    { id: 'treat-3', appointmentId: 'dent-3', treatmentType: 'Ortodoncia', description: 'Instalación de brackets', cost: 8000, sessions: 24, status: 'en-progreso', createdAt: '2024-10-25' }
  ]
};

export function DentalAppointmentsListPage() {
  const { dentalAppointments } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dentistFilter, setDentistFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState<DentalAppointment | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  
  // CRUD Dialogs
  const [isCreateAppointmentOpen, setIsCreateAppointmentOpen] = useState(false);
  const [isEditAppointmentOpen, setIsEditAppointmentOpen] = useState(false);
  const [isViewAppointmentOpen, setIsViewAppointmentOpen] = useState(false);
  const [isCreateTreatmentOpen, setIsCreateTreatmentOpen] = useState(false);
  const [isEditTreatmentOpen, setIsEditTreatmentOpen] = useState(false);
  const [isViewTreatmentOpen, setIsViewTreatmentOpen] = useState(false);
  
  const [selectedTreatment, setSelectedTreatment] = useState<any>(null);
  const [currentAppointmentForTreatment, setCurrentAppointmentForTreatment] = useState<string>('');

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

  const toggleRow = (appointmentId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(appointmentId)) {
      newExpanded.delete(appointmentId);
    } else {
      newExpanded.add(appointmentId);
    }
    setExpandedRows(newExpanded);
  };

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
      'completado': 'bg-green-100 text-green-800',
      'cancelada': 'bg-red-100 text-red-800',
      'en-progreso': 'bg-blue-100 text-blue-800'
    };
    
    return (
      <Badge className={statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  const handleViewAppointment = (appointment: DentalAppointment) => {
    setSelectedAppointment(appointment);
    setIsViewAppointmentOpen(true);
  };

  const handleEditAppointment = (appointment: DentalAppointment) => {
    setSelectedAppointment(appointment);
    setIsEditAppointmentOpen(true);
  };

  const handleDeleteAppointment = (appointment: DentalAppointment) => {
    if (window.confirm(`¿Está seguro que desea eliminar la cita de ${appointment.studentName}?`)) {
      toast.success('Cita eliminada correctamente');
    }
  };

  const handleCreateTreatment = (appointmentId: string) => {
    setCurrentAppointmentForTreatment(appointmentId);
    setIsCreateTreatmentOpen(true);
  };

  const handleViewTreatment = (treatment: any) => {
    setSelectedTreatment(treatment);
    setIsViewTreatmentOpen(true);
  };

  const handleEditTreatment = (treatment: any) => {
    setSelectedTreatment(treatment);
    setIsEditTreatmentOpen(true);
  };

  const handleDeleteTreatment = (treatment: any) => {
    if (window.confirm(`¿Está seguro que desea eliminar este tratamiento?`)) {
      toast.success('Tratamiento eliminado correctamente');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setDentistFilter('all');
    toast.success('Filtros limpiados');
  };

  const getTreatments = (appointmentId: string) => {
    return mockTreatments[appointmentId as keyof typeof mockTreatments] || [];
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

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Button 
                onClick={() => setIsCreateAppointmentOpen(true)} 
                className="bg-[#004aad] hover:bg-[#003687] w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Cita
              </Button>
            </div>

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
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>No. Cuenta</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Odontólogo Asignado</TableHead>
                  <TableHead>Fecha Preferida</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => {
                  const isExpanded = expandedRows.has(appointment.id);
                  const treatments = getTreatments(appointment.id);
                  
                  return (
                    <React.Fragment key={appointment.id}>
                      <TableRow className="hover:bg-gray-50">
                        <TableCell>
                          {treatments.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleRow(appointment.id)}
                              className="p-0 h-6 w-6"
                            >
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </TableCell>
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
                          {getStatusBadge(appointment.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewAppointment(appointment)}
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Ver Detalles
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditAppointment(appointment)}
                              className="text-[#edba0d] border-[#edba0d] hover:bg-yellow-50"
                            >
                              <Pencil className="w-3 h-3 mr-1" />
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteAppointment(appointment)}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Eliminar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      
                      {/* Expanded Row - Treatments */}
                      {isExpanded && treatments.length > 0 && (
                        <TableRow>
                          <TableCell colSpan={9} className="bg-gray-50 p-0">
                            <div className="p-4">
                              <div className="flex justify-between items-center mb-3">
                                <h4 className="font-medium text-sm">Tratamientos</h4>
                                <Button
                                  size="sm"
                                  onClick={() => handleCreateTreatment(appointment.id)}
                                  className="bg-[#004aad] hover:bg-[#003687]"
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  Crear Tratamiento
                                </Button>
                              </div>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Tipo de Tratamiento</TableHead>
                                    <TableHead>Descripción</TableHead>
                                    <TableHead>Costo (L)</TableHead>
                                    <TableHead>Sesiones</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Fecha Creación</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {treatments.map((treatment) => (
                                    <TableRow key={treatment.id} className="hover:bg-white">
                                      <TableCell className="font-medium">{treatment.treatmentType}</TableCell>
                                      <TableCell className="max-w-48 truncate">{treatment.description}</TableCell>
                                      <TableCell>L {treatment.cost.toFixed(2)}</TableCell>
                                      <TableCell>{treatment.sessions}</TableCell>
                                      <TableCell>{getStatusBadge(treatment.status)}</TableCell>
                                      <TableCell>{formatDate(treatment.createdAt)}</TableCell>
                                      <TableCell className="text-right">
                                        <div className="flex gap-1 justify-end">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleViewTreatment(treatment)}
                                            className="text-blue-600 hover:bg-blue-50"
                                          >
                                            <Eye className="w-3 h-3 mr-1" />
                                            Ver Detalles
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleEditTreatment(treatment)}
                                            className="text-[#edba0d] hover:bg-yellow-50"
                                          >
                                            <Pencil className="w-3 h-3 mr-1" />
                                            Editar
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleDeleteTreatment(treatment)}
                                            className="text-red-600 hover:bg-red-50"
                                          >
                                            <Trash2 className="w-3 h-3 mr-1" />
                                            Eliminar
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Appointment Dialog */}
      <Dialog open={isCreateAppointmentOpen} onOpenChange={setIsCreateAppointmentOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Nueva Cita Odontológica</DialogTitle>
            <DialogDescription>
              Ingrese los datos de la cita a crear
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-500">Formulario de creación de cita...</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateAppointmentOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                toast.success('Cita creada exitosamente');
                setIsCreateAppointmentOpen(false);
              }}
              className="bg-[#004aad] hover:bg-[#003687]"
            >
              Crear Cita
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Appointment Dialog */}
      <Dialog open={isEditAppointmentOpen} onOpenChange={setIsEditAppointmentOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Cita Odontológica</DialogTitle>
            <DialogDescription>
              Modifique los datos de la cita
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-500">Formulario de edición de cita...</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditAppointmentOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                toast.success('Cita actualizada exitosamente');
                setIsEditAppointmentOpen(false);
              }}
              className="bg-[#004aad] hover:bg-[#003687]"
            >
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Appointment Details Modal */}
      <Dialog open={isViewAppointmentOpen} onOpenChange={() => setIsViewAppointmentOpen(false)}>
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

              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t">
                <Button 
                  onClick={() => setIsViewAppointmentOpen(false)}
                  className="bg-[#edba0d] hover:bg-[#d4a40b] text-white"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Treatment Dialog */}
      <Dialog open={isCreateTreatmentOpen} onOpenChange={setIsCreateTreatmentOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Tratamiento</DialogTitle>
            <DialogDescription>
              Ingrese los datos del tratamiento
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tipo de Tratamiento</Label>
              <Input placeholder="Ej: Limpieza Dental" />
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea placeholder="Describa el tratamiento..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Costo (Lempiras)</Label>
                <Input type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label>Sesiones</Label>
                <Input type="number" placeholder="1" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateTreatmentOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                toast.success('Tratamiento creado exitosamente');
                setIsCreateTreatmentOpen(false);
              }}
              className="bg-[#004aad] hover:bg-[#003687]"
            >
              Crear Tratamiento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Treatment Dialog */}
      <Dialog open={isEditTreatmentOpen} onOpenChange={setIsEditTreatmentOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Tratamiento</DialogTitle>
            <DialogDescription>
              Modifique los datos del tratamiento
            </DialogDescription>
          </DialogHeader>
          {selectedTreatment && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Tipo de Tratamiento</Label>
                <Input defaultValue={selectedTreatment.treatmentType} />
              </div>
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Textarea defaultValue={selectedTreatment.description} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Costo (Lempiras)</Label>
                  <Input type="number" defaultValue={selectedTreatment.cost} />
                </div>
                <div className="space-y-2">
                  <Label>Sesiones</Label>
                  <Input type="number" defaultValue={selectedTreatment.sessions} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditTreatmentOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                toast.success('Tratamiento actualizado exitosamente');
                setIsEditTreatmentOpen(false);
              }}
              className="bg-[#004aad] hover:bg-[#003687]"
            >
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Treatment Dialog */}
      <Dialog open={isViewTreatmentOpen} onOpenChange={() => setIsViewTreatmentOpen(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del Tratamiento</DialogTitle>
            <DialogDescription>
              Información completa del tratamiento seleccionado
            </DialogDescription>
          </DialogHeader>
          {selectedTreatment && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-gray-600">Tipo de Tratamiento</Label>
                <p className="mt-1">{selectedTreatment.treatmentType}</p>
              </div>
              <div>
                <Label className="text-gray-600">Descripción</Label>
                <p className="mt-1">{selectedTreatment.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">Costo</Label>
                  <p className="mt-1">L {selectedTreatment.cost.toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Sesiones</Label>
                  <p className="mt-1">{selectedTreatment.sessions}</p>
                </div>
              </div>
              <div>
                <Label className="text-gray-600">Estado</Label>
                <div className="mt-1">{getStatusBadge(selectedTreatment.status)}</div>
              </div>
              <div>
                <Label className="text-gray-600">Fecha de Creación</Label>
                <p className="mt-1">{formatDate(selectedTreatment.createdAt)}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewTreatmentOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
