import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { SupportSession, DentalAppointment } from '../../types';
import { useData } from '../../context/DataContext';
import { Eye, Edit, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { getStatusColor, getEmotionalLevelText } from '../../utils/statusHelpers';
import { formatDateTime } from '../../utils/dateHelpers';

interface RequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: SupportSession | DentalAppointment | null;
  type: 'support' | 'dental';
}

export function RequestDetailsModal({ isOpen, onClose, request, type }: RequestDetailsModalProps) {
  const { updateSupportSession, updateDentalAppointment } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});

  if (!request) return null;

  const canEdit = request.status === 'pendiente';
  const canCancel = request.status === 'pendiente' || request.status === 'asignada' || request.status === 'confirmada';

  const startEdit = () => {
    setIsEditing(true);
    if (type === 'support') {
      const session = request as SupportSession;
      setEditData({
        mainReason: session.mainReason,
        emotionalLevel: session.emotionalLevel.toString(),
        previousSessions: session.previousSessions ? 'si' : 'no',
        preferredTime: session.preferredTime,
        modality: session.modality,
        additionalComments: session.additionalComments || ''
      });
    } else {
      const appointment = request as DentalAppointment;
      setEditData({
        preferredDate: appointment.preferredDate,
        preferredTime: appointment.preferredTime,
        reason: appointment.reason,
        priority: appointment.priority
      });
    }
  };

  const saveChanges = () => {
    if (type === 'support') {
      const session = request as SupportSession;
      if (!editData.mainReason?.trim()) {
        toast.error('El motivo principal es obligatorio');
        return;
      }
      
      updateSupportSession(session.id, {
        mainReason: editData.mainReason,
        emotionalLevel: parseInt(editData.emotionalLevel),
        previousSessions: editData.previousSessions === 'si',
        preferredTime: editData.preferredTime,
        modality: editData.modality as 'virtual' | 'presencial',
        additionalComments: editData.additionalComments || undefined
      });
    } else {
      const appointment = request as DentalAppointment;
      if (!editData.reason?.trim()) {
        toast.error('El motivo de la consulta es obligatorio');
        return;
      }
      
      updateDentalAppointment(appointment.id, {
        preferredDate: editData.preferredDate,
        preferredTime: editData.preferredTime,
        reason: editData.reason,
        priority: editData.priority as 'baja' | 'media' | 'alta'
      });
    }
    
    toast.success('Solicitud actualizada correctamente');
    setIsEditing(false);
  };

  const cancelRequest = () => {
    if (type === 'support') {
      updateSupportSession(request.id, { status: 'rechazada' });
    } else {
      updateDentalAppointment(request.id, { status: 'cancelada' });
    }
    toast.success('Solicitud cancelada');
    onClose();
  };

  const renderSupportDetails = () => {
    const session = request as SupportSession;
    
    if (isEditing) {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mainReason">Motivo principal de la consulta *</Label>
            <Textarea
              id="mainReason"
              value={editData.mainReason}
              onChange={(e) => setEditData(prev => ({ ...prev, mainReason: e.target.value }))}
              rows={4}
            />
          </div>

          <div className="space-y-3">
            <Label>Nivel actual de malestar emocional (1-5) *</Label>
            <RadioGroup
              value={editData.emotionalLevel}
              onValueChange={(value) => setEditData(prev => ({ ...prev, emotionalLevel: value }))}
              className="flex flex-wrap gap-4"
            >
              {[1, 2, 3, 4, 5].map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <RadioGroupItem value={level.toString()} id={`level-${level}`} />
                  <Label htmlFor={`level-${level}`} className="cursor-pointer">
                    {level} {level === 1 ? '(Bajo)' : level === 5 ? '(Alto)' : ''}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>¿Has asistido antes a sesiones psicológicas? *</Label>
            <RadioGroup
              value={editData.previousSessions}
              onValueChange={(value) => setEditData(prev => ({ ...prev, previousSessions: value }))}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="si" id="edit-previous-si" />
                <Label htmlFor="edit-previous-si" className="cursor-pointer">Sí</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="edit-previous-no" />
                <Label htmlFor="edit-previous-no" className="cursor-pointer">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Preferencia de horario</Label>
            <Select value={editData.preferredTime} onValueChange={(value) => setEditData(prev => ({ ...prev, preferredTime: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="07:00">7:00 AM</SelectItem>
                <SelectItem value="08:00">8:00 AM</SelectItem>
                <SelectItem value="09:00">9:00 AM</SelectItem>
                <SelectItem value="10:00">10:00 AM</SelectItem>
                <SelectItem value="11:00">11:00 AM</SelectItem>
                <SelectItem value="13:00">1:00 PM</SelectItem>
                <SelectItem value="14:00">2:00 PM</SelectItem>
                <SelectItem value="15:00">3:00 PM</SelectItem>
                <SelectItem value="16:00">4:00 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Modalidad</Label>
            <RadioGroup
              value={editData.modality}
              onValueChange={(value) => setEditData(prev => ({ ...prev, modality: value }))}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="presencial" id="edit-modality-presencial" />
                <Label htmlFor="edit-modality-presencial" className="cursor-pointer">Presencial</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="virtual" id="edit-modality-virtual" />
                <Label htmlFor="edit-modality-virtual" className="cursor-pointer">Virtual</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Comentarios adicionales (opcional)</Label>
            <Textarea
              value={editData.additionalComments}
              onChange={(e) => setEditData(prev => ({ ...prev, additionalComments: e.target.value }))}
              rows={3}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-1">Motivo principal</h4>
          <p className="text-gray-700">{session.mainReason}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Nivel de malestar</h4>
            <Badge className={getStatusColor(session.emotionalLevel >= 4 ? 'alta' : 'baja')}>
              {getEmotionalLevelText(session.emotionalLevel)}
            </Badge>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Sesiones previas</h4>
            <p className="text-gray-700">{session.previousSessions ? 'Sí' : 'No'}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Horario preferido</h4>
            <p className="text-gray-700">{session.preferredTime}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Modalidad</h4>
            <p className="text-gray-700 capitalize">{session.modality}</p>
          </div>
        </div>
        
        {session.additionalComments && (
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Comentarios adicionales</h4>
            <p className="text-gray-700">{session.additionalComments}</p>
          </div>
        )}
        
        {session.assignedCounselorName && (
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Consejero asignado</h4>
            <p className="text-gray-700">{session.assignedCounselorName}</p>
          </div>
        )}
      </div>
    );
  };

  const renderDentalDetails = () => {
    const appointment = request as DentalAppointment;
    
    if (isEditing) {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferredDate">Fecha preferida *</Label>
              <Input
                id="preferredDate"
                type="date"
                value={editData.preferredDate}
                onChange={(e) => setEditData(prev => ({ ...prev, preferredDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Hora preferida *</Label>
              <Select value={editData.preferredTime} onValueChange={(value) => setEditData(prev => ({ ...prev, preferredTime: value }))}>
                <SelectTrigger>
                  <SelectValue />
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

          <div className="space-y-2">
            <Label htmlFor="reason">Motivo de la consulta *</Label>
            <Textarea
              id="reason"
              value={editData.reason}
              onChange={(e) => setEditData(prev => ({ ...prev, reason: e.target.value }))}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Prioridad</Label>
            <Select value={editData.priority} onValueChange={(value) => setEditData(prev => ({ ...prev, priority: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baja">Baja - Revisión o limpieza</SelectItem>
                <SelectItem value="media">Media - Molestia leve</SelectItem>
                <SelectItem value="alta">Alta - Dolor fuerte o urgencia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Fecha preferida</h4>
            <p className="text-gray-700">{appointment.preferredDate}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Hora preferida</h4>
            <p className="text-gray-700">{appointment.preferredTime}</p>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-1">Motivo de la consulta</h4>
          <p className="text-gray-700">{appointment.reason}</p>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-1">Prioridad</h4>
          <Badge className={getStatusColor(appointment.priority)}>
            {appointment.priority.toUpperCase()}
          </Badge>
        </div>
        
        {appointment.assignedDentistName && (
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Odontólogo asignado</h4>
            <p className="text-gray-700">{appointment.assignedDentistName}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#004aad]" />
            Detalles de la Solicitud
          </DialogTitle>
          <DialogDescription>
            {type === 'support' ? 'Sesión de Apoyo Psicológico' : 'Cita Odontológica'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Date */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Estado de la solicitud</h3>
                <Badge className={getStatusColor(request.status)}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </Badge>
              </div>
              <div className="text-right text-sm text-gray-600">
                <p>Solicitud creada:</p>
                <p className="font-medium">{formatDateTime(request.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Details */}
          {type === 'support' ? renderSupportDetails() : renderDentalDetails()}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            {canCancel && (
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={cancelRequest}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Cancelar Solicitud
              </Button>
            )}
            
            <div className="flex gap-3 ml-auto">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button onClick={saveChanges} className="bg-[#004aad] hover:bg-[#003687] text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={onClose}>
                    Cerrar
                  </Button>
                  {canEdit && (
                    <Button onClick={startEdit} className="bg-[#004aad] hover:bg-[#003687] text-white">
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}