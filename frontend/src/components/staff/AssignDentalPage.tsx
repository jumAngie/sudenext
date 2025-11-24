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
import { useAuth } from "../../context/AuthContext";
import { DentalAppointment } from '../../types';
import {
  Stethoscope, Clock, Calendar, User, CheckCircle, X, UserPlus,
  Edit, AlertTriangle, Eye
} from 'lucide-react';
import { toast } from "sonner";
import { getLocalDateTime } from '../../utils/dateHelpers';

// Mock dentists data
const mockDentists = [
  { id: 'staff-2', name: 'Dra. Carmen Flores', specialty: 'Odontología General' },
  { id: 'staff-8', name: 'Dr. Roberto Medina', specialty: 'Endodoncia' },
  { id: 'staff-9', name: 'Dra. Sofia Vargas', specialty: 'Ortodoncia' }
];

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

  const { personalOdontologo, assignDentist } = useData();
  const { user } = useAuth();
  const [selectedPersonal, setSelectedPersonal] = useState(null);

  const { dentalAppointments, updateDentalAppointment } = useData();
  const [selectedAppointment, setSelectedAppointment] = useState<DentalAppointment | null>(null);
  const [assignedDentist, setAssignedDentist] = useState('');
  const [confirmedDate, setConfirmedDate] = useState('');
  const [confirmedTime, setConfirmedTime] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [viewAppointment, setViewAppointment] = useState<DentalAppointment | null>(null);

  const handleAssignOrEdit = (appointment: DentalAppointment) => {
    setSelectedAppointment(appointment);
    setAssignedDentist(appointment.assignedDentistId || '');
    setConfirmedDate(appointment.preferredDate);
    setConfirmedTime(appointment.preferredTime);
    setRejectionReason('');
    setIsRejecting(false);
  };

  const handleViewDetails = (appointment: DentalAppointment) => {
    setViewAppointment(appointment);
  };

  // CONFIRMACIÓN
  const confirmAssignment = async () => {
    if (!selectedAppointment || !assignedDentist) {
      toast.error("Debes seleccionar un odontólogo.");
      return;
    }
    const payload = {
      sco_ID: selectedAppointment.id,
      per_ID: parseInt(assignedDentist),
      sca_Cancel: false,
      usu_UsuarioCreacion: Number(user?.data?.id),
      sca_FechaCreacion: getLocalDateTime()
    };
    const message = await assignDentist(payload);
    if (!message.toLowerCase().includes("correctamente")) {
      toast.error(message);
      return;
    }
    toast.success(message);
    setSelectedAppointment(null);
  };

  const rejectAppointment = () => {
    if (!selectedAppointment) return;
    if (!rejectionReason.trim()) {
      toast.error('Debes proporcionar una razón para el rechazo');
      return;
    }
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
      case 'pendiente':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
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

      {/* Unified Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Citas Odontológicas</CardTitle>
          <CardDescription>
            Todas las citas con opción de asignar o editar odontólogo
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dentalAppointments.length === 0 ? (
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
                  <TableHead>Odontólogo Asignado</TableHead>
                  <TableHead>Fecha Preferida</TableHead>
                  <TableHead>Fecha Solicitud</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dentalAppointments.map((appointment) => (
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
                        <Calendar className="w-3 h-3" />
                        {formatDate(appointment.createdAt)}
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
                          onClick={() => handleViewDetails(appointment)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Ver Detalles
                        </Button>
                        {appointment.assignedDentistId ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAssignOrEdit(appointment)}
                            className="text-[#edba0d] border-[#edba0d] hover:bg-yellow-50"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Editar
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleAssignOrEdit(appointment)}
                            className="bg-[#edba0d] hover:bg-[#d4a40b] text-white"
                          >
                            <UserPlus className="w-3 h-3 mr-1" />
                            Asignar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Assignment/Edit Dialog */}
      <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#edba0d]" />
              {selectedAppointment?.assignedDentistId
                ? 'Editar Asignación de Odontólogo'
                : 'Asignar Odontólogo'}
            </DialogTitle>
            <DialogDescription>
              {selectedAppointment?.assignedDentistId
                ? 'Modifica la asignación del odontólogo, fecha y hora para esta cita'
                : 'Revisa la información del estudiante y asigna el odontólogo más apropiado'}
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
                {selectedAppointment.assignedDentistName && (
                  <div className="mt-2">
                    <span className="text-gray-600">Odontólogo Actual:</span>
                    <p className="font-medium text-yellow-600">{selectedAppointment.assignedDentistName}</p>
                  </div>
                )}
              </div>

              {!isRejecting ? (
                <>
                  {/* Dentist Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      {selectedAppointment.assignedDentistId
                        ? 'Nuevo Odontólogo Asignado'
                        : 'Seleccionar Odontólogo'}
                    </Label>
                    <Select value={assignedDentist} onValueChange={setAssignedDentist}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un odontólogo" />
                      </SelectTrigger>
                      <SelectContent>
                        {personalOdontologo.map((dentist) => (
                          <SelectItem key={dentist.per_ID} value={dentist.per_ID}>
                            <div>
                              <p className="font-medium">{dentist.per_Nombres}</p>
                              <p className="text-xs text-gray-500">{dentist.per_Correo}</p>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex justify-between pt-4 border-t">
                    {!selectedAppointment.assignedDentistId && (
                      <Button
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => setIsRejecting(true)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Rechazar Cita
                      </Button>
                    )}
                    <div className="flex gap-3 ml-auto">
                      <Button variant="outline" onClick={() => setSelectedAppointment(null)}>
                        Cancelar
                      </Button>
                      <Button
                        onClick={confirmAssignment}
                        className="bg-[#edba0d] hover:bg-[#d4a40b] text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {selectedAppointment.assignedDentistId
                          ? 'Guardar Cambios'
                          : 'Confirmar Asignación'}
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
                    <Button
                      variant="outline"
                      onClick={() => setIsRejecting(false)}
                    >
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

      {/* View Details Dialog */}
      <Dialog open={!!viewAppointment} onOpenChange={() => setViewAppointment(null)}>
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

          {viewAppointment && (
            <div className="space-y-6">
              {/* Patient Information */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-[#004aad] mb-3">Información del Paciente</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Nombre:</span>
                    <p className="font-medium">{viewAppointment.studentName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">No. Cuenta:</span>
                    <p className="font-medium">{viewAppointment.accountNumber}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Prioridad:</span>
                    <div className="flex items-center gap-1 mt-1">
                      {getPriorityIcon(viewAppointment.priority)}
                      <Badge className={getPriorityColor(viewAppointment.priority)}>
                        {viewAppointment.priority.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Fecha Preferida:</span>
                    <p className="font-medium">{viewAppointment.preferredDate}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Hora Preferida:</span>
                    <p className="font-medium">{viewAppointment.preferredTime}</p>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Motivo de la Consulta</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {viewAppointment.reason}
                  </p>
                </div>
              </div>

              {/* Assignment Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Información de Asignación</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Estado:</span>
                    <div className="mt-1">{getStatusBadge(viewAppointment.status)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Odontólogo Asignado:</span>
                    <p className="font-medium">
                      {viewAppointment.assignedDentistName || 'Sin asignar'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Fecha de Solicitud:</span>
                    <p className="font-medium">{formatDate(viewAppointment.createdAt)}</p>
                  </div>
                  {viewAppointment.confirmedAt && (
                    <div>
                      <span className="text-gray-600">Fecha de Confirmación:</span>
                      <p className="font-medium">{formatDate(viewAppointment.confirmedAt)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t">
                <Button
                  onClick={() => setViewAppointment(null)}
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
