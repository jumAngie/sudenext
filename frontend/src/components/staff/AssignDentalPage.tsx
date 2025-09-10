import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useData } from '../../context/DataContext';
import { DentalAppointment } from '../../types';
import { 
  Stethoscope, Clock, Calendar, User, CheckCircle, X, UserPlus, 
  Edit, History, AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { formatDateTime } from '../../utils/dateHelpers';
import { getStatusColor } from '../../utils/statusHelpers';

// Mock dentists data
const mockDentists = [
  { id: 'staff-2', name: 'Dra. Carmen Flores', specialty: 'Odontología General' },
  { id: 'staff-8', name: 'Dr. Roberto Medina', specialty: 'Endodoncia' },
  { id: 'staff-9', name: 'Dra. Sofia Vargas', specialty: 'Ortodoncia' }
];

interface EditAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: DentalAppointment | null;
  onSave: (data: { dentistId: string; date: string; time: string }) => void;
}

function EditAssignmentModal({ isOpen, onClose, appointment, onSave }: EditAssignmentModalProps) {
  const [newDentistId, setNewDentistId] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  React.useEffect(() => {
    if (appointment) {
      setNewDentistId(appointment.assignedDentistId || '');
      setNewDate(appointment.preferredDate || '');
      setNewTime(appointment.preferredTime || '');
    }
  }, [appointment]);

  const handleSave = () => {
    if (!newDentistId) {
      toast.error('Debes seleccionar un odontólogo');
      return;
    }
    if (!newDate || !newTime) {
      toast.error('Debes seleccionar fecha y hora');
      return;
    }
    onSave({ dentistId: newDentistId, date: newDate, time: newTime });
    onClose();
  };

  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-[#edba0d]" />
            Editar Asignación de Cita Odontológica
          </DialogTitle>
          <DialogDescription>
            Modifica la asignación del odontólogo, fecha y hora para esta cita
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Appointment Information */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-[#004aad] mb-3">Información de la Cita</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Paciente:</span>
                <p className="font-medium">{appointment.studentName}</p>
              </div>
              <div>
                <span className="text-gray-600">No. Cuenta:</span>
                <p className="font-medium">{appointment.accountNumber}</p>
              </div>
              <div>
                <span className="text-gray-600">Estado:</span>
                <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
              </div>
              <div>
                <span className="text-gray-600">Prioridad:</span>
                <Badge className={getPriorityColor(appointment.priority)}>
                  {appointment.priority.toUpperCase()}
                </Badge>
              </div>
            </div>
            <div className="mt-3">
              <span className="text-gray-600">Motivo de la Consulta:</span>
              <p className="font-medium">{appointment.reason}</p>
            </div>
            <div className="mt-2">
              <span className="text-gray-600">Odontólogo Actual:</span>
              <p className="font-medium text-yellow-600">{appointment.assignedDentistName}</p>
            </div>
          </div>

          {/* New Assignment Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nuevo Odontólogo Asignado</Label>
              <Select value={newDentistId} onValueChange={setNewDentistId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un odontólogo" />
                </SelectTrigger>
                <SelectContent>
                  {mockDentists.map((dentist) => (
                    <SelectItem key={dentist.id} value={dentist.id}>
                      <div>
                        <p className="font-medium">{dentist.name}</p>
                        <p className="text-xs text-gray-500">{dentist.specialty}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nueva Fecha</Label>
                <Input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Nueva Hora</Label>
                <Select value={newTime} onValueChange={setNewTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona hora" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="07:00">7:00 AM</SelectItem>
                    <SelectItem value="07:30">7:30 AM</SelectItem>
                    <SelectItem value="08:00">8:00 AM</SelectItem>
                    <SelectItem value="08:30">8:30 AM</SelectItem>
                    <SelectItem value="09:00">9:00 AM</SelectItem>
                    <SelectItem value="09:30">9:30 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="10:30">10:30 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    <SelectItem value="11:30">11:30 AM</SelectItem>
                    <SelectItem value="13:00">1:00 PM</SelectItem>
                    <SelectItem value="13:30">1:30 PM</SelectItem>
                    <SelectItem value="14:00">2:00 PM</SelectItem>
                    <SelectItem value="14:30">2:30 PM</SelectItem>
                    <SelectItem value="15:00">3:00 PM</SelectItem>
                    <SelectItem value="15:30">3:30 PM</SelectItem>
                    <SelectItem value="16:00">4:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#edba0d] hover:bg-[#d4a40b] text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'alta': return 'bg-red-100 text-red-800';
    case 'media': return 'bg-yellow-100 text-yellow-800';
    case 'baja': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getPriorityIcon(priority: string) {
  switch (priority) {
    case 'alta': return <AlertTriangle className="w-3 h-3 text-red-600" />;
    case 'media': return <Clock className="w-3 h-3 text-yellow-600" />;
    case 'baja': return <CheckCircle className="w-3 h-3 text-green-600" />;
    default: return <div className="w-3 h-3" />;
  }
}

export function AssignDentalPage() {
  const { dentalAppointments, updateDentalAppointment } = useData();
  const [selectedAppointment, setSelectedAppointment] = useState<DentalAppointment | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<DentalAppointment | null>(null);
  const [assignedDentist, setAssignedDentist] = useState('');
  const [confirmedDate, setConfirmedDate] = useState('');
  const [confirmedTime, setConfirmedTime] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const pendingAppointments = dentalAppointments.filter(a => a.status === 'pendiente');
  const assignedAppointments = dentalAppointments.filter(a => 
    a.status === 'confirmada' || a.status === 'completada'
  );

  const handleAssignAppointment = (appointment: DentalAppointment) => {
    setSelectedAppointment(appointment);
    setAssignedDentist('');
    setConfirmedDate(appointment.preferredDate);
    setConfirmedTime(appointment.preferredTime);
    setRejectionReason('');
    setIsRejecting(false);
  };

  const handleEditAssignment = (appointment: DentalAppointment) => {
    setEditingAppointment(appointment);
    setShowEditModal(true);
  };

  const confirmAssignment = () => {
    if (!selectedAppointment || !assignedDentist) {
      toast.error('Debes seleccionar un odontólogo');
      return;
    }

    if (!confirmedDate || !confirmedTime) {
      toast.error('Debes confirmar la fecha y hora de la cita');
      return;
    }

    const dentist = mockDentists.find(d => d.id === assignedDentist);
    if (!dentist) return;

    updateDentalAppointment(selectedAppointment.id, {
      status: 'confirmada',
      assignedDentistId: assignedDentist,
      assignedDentistName: dentist.name,
      preferredDate: confirmedDate,
      preferredTime: confirmedTime,
      confirmedAt: new Date().toISOString()
    });

    toast.success('Cita odontológica asignada correctamente');
    setSelectedAppointment(null);
  };

  const saveEditAssignment = (data: { dentistId: string; date: string; time: string }) => {
    if (!editingAppointment) return;

    const newDentist = mockDentists.find(d => d.id === data.dentistId);
    if (!newDentist) return;

    updateDentalAppointment(editingAppointment.id, {
      assignedDentistId: data.dentistId,
      assignedDentistName: newDentist.name,
      preferredDate: data.date,
      preferredTime: data.time
    });

    toast.success('Asignación actualizada correctamente');
    setEditingAppointment(null);
  };

  const rejectAppointment = () => {
    if (!selectedAppointment) return;

    if (!rejectionReason.trim()) {
      toast.error('Debes proporcionar una razón para el rechazo');
      return;
    }

    updateDentalAppointment(selectedAppointment.id, {
      status: 'cancelada'
    });

    toast.success('Cita rechazada');
    setSelectedAppointment(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-HN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmada':
        return <Badge className="bg-blue-100 text-blue-800">Confirmada</Badge>;
      case 'completada':
        return <Badge className="bg-green-100 text-green-800">Completada</Badge>;
      case 'cancelada':
        return <Badge className="bg-red-100 text-red-800">Cancelada</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-[#edba0d]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#004aad]">
            <UserPlus className="w-5 h-5" />
            Asignación de Citas Odontológicas
          </CardTitle>
          <CardDescription>
            Revisa las solicitudes de citas odontológicas y asigna odontólogos apropiados
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAppointments.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas Confirmadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dentalAppointments.filter(a => a.status === 'confirmada').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dentalAppointments.filter(a => a.status === 'completada').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Odontólogos Disponibles</CardTitle>
            <User className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDentists.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes Pendientes de Asignación</CardTitle>
          <CardDescription>
            Citas odontológicas que requieren asignación de especialista
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay citas pendientes de asignación</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>No. Cuenta</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Fecha Preferida</TableHead>
                  <TableHead>Hora Preferida</TableHead>
                  <TableHead>Fecha Solicitud</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingAppointments.map((appointment) => (
                  <TableRow key={appointment.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {appointment.studentName}
                    </TableCell>
                    <TableCell className="font-mono">
                      {appointment.accountNumber}
                    </TableCell>
                    <TableCell className="max-w-64">
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
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => handleAssignAppointment(appointment)}
                        className="bg-[#edba0d] hover:bg-[#d4a40b] text-white"
                      >
                        <UserPlus className="w-3 h-3 mr-1" />
                        Asignar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Assigned Appointments History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Historial de Citas Asignadas
          </CardTitle>
          <CardDescription>
            Citas ya asignadas a odontólogos con opción de editar la asignación
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assignedAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay citas asignadas aún</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>No. Cuenta</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Odontólogo Asignado</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Fecha de Cita</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignedAppointments.map((appointment) => (
                  <TableRow key={appointment.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {appointment.studentName}
                    </TableCell>
                    <TableCell className="font-mono">
                      {appointment.accountNumber}
                    </TableCell>
                    <TableCell className="max-w-64">
                      <p className="truncate" title={appointment.reason}>
                        {appointment.reason}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 text-yellow-600" />
                        <span className="text-yellow-600 font-medium">
                          {appointment.assignedDentistName}
                        </span>
                      </div>
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
                      {getStatusBadge(appointment.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      {appointment.status === 'confirmada' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditAssignment(appointment)}
                          className="text-[#edba0d] border-[#edba0d] hover:bg-[#edba0d] hover:text-white"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Editar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Assignment Dialog */}
      <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#edba0d]" />
              Asignar Odontólogo
            </DialogTitle>
            <DialogDescription>
              Revisa la información del estudiante y asigna el odontólogo más apropiado
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-6">
              {/* Student Information */}
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
                    <Badge className={getPriorityColor(selectedAppointment.priority)}>
                      {selectedAppointment.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-gray-600">Fecha Preferida:</span>
                    <p className="font-medium">{selectedAppointment.preferredDate} - {selectedAppointment.preferredTime}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-gray-600">Motivo de la Consulta:</span>
                  <p className="font-medium">{selectedAppointment.reason}</p>
                </div>
              </div>

              {!isRejecting ? (
                <>
                  {/* Dentist Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Seleccionar Odontólogo</Label>
                    <Select value={assignedDentist} onValueChange={setAssignedDentist}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un odontólogo" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockDentists.map((dentist) => (
                          <SelectItem key={dentist.id} value={dentist.id}>
                            <div>
                              <p className="font-medium">{dentist.name}</p>
                              <p className="text-xs text-gray-500">{dentist.specialty}</p>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date and Time Confirmation */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="confirmedDate">Fecha de la Cita</Label>
                      <Input
                        id="confirmedDate"
                        type="date"
                        value={confirmedDate}
                        onChange={(e) => setConfirmedDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmedTime">Hora de la Cita</Label>
                      <Select value={confirmedTime} onValueChange={setConfirmedTime}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona hora" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="07:00">7:00 AM</SelectItem>
                          <SelectItem value="07:30">7:30 AM</SelectItem>
                          <SelectItem value="08:00">8:00 AM</SelectItem>
                          <SelectItem value="08:30">8:30 AM</SelectItem>
                          <SelectItem value="09:00">9:00 AM</SelectItem>
                          <SelectItem value="09:30">9:30 AM</SelectItem>
                          <SelectItem value="10:00">10:00 AM</SelectItem>
                          <SelectItem value="10:30">10:30 AM</SelectItem>
                          <SelectItem value="11:00">11:00 AM</SelectItem>
                          <SelectItem value="11:30">11:30 AM</SelectItem>
                          <SelectItem value="13:00">1:00 PM</SelectItem>
                          <SelectItem value="13:30">1:30 PM</SelectItem>
                          <SelectItem value="14:00">2:00 PM</SelectItem>
                          <SelectItem value="14:30">2:30 PM</SelectItem>
                          <SelectItem value="15:00">3:00 PM</SelectItem>
                          <SelectItem value="15:30">3:30 PM</SelectItem>
                          <SelectItem value="16:00">4:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between pt-4 border-t">
                    <Button
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => setIsRejecting(true)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Rechazar Cita
                    </Button>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setSelectedAppointment(null)}>
                        Cancelar
                      </Button>
                      <Button
                        onClick={confirmAssignment}
                        className="bg-[#edba0d] hover:bg-[#d4a40b] text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Confirmar Asignación
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Rejection Form */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-red-600">
                      Razón del Rechazo
                    </Label>
                    <Textarea
                      placeholder="Explica por qué se rechaza esta cita..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={4}
                    />
                  </div>

                  {/* Rejection Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="outline" onClick={() => setIsRejecting(false)}>
                      Cancelar
                    </Button>
                    <Button
                      onClick={rejectAppointment}
                      variant="destructive"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Confirmar Rechazo
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Assignment Modal */}
      <EditAssignmentModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        appointment={editingAppointment}
        onSave={saveEditAssignment}
      />
    </div>
  );
}