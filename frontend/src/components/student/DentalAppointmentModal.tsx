import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Student } from '../../types';
import { toast } from 'sonner@2.0.3';
import { Stethoscope, Calendar, Clock, AlertTriangle } from 'lucide-react';

interface DentalAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DentalAppointmentModal({ isOpen, onClose }: DentalAppointmentModalProps) {
  const { user } = useAuth();
  const { addDentalAppointment } = useData();
  const student = user?.data as Student;

  const [formData, setFormData] = useState({
    preferredDate: '',
    preferredTime: '',
    reason: '',
    priority: 'media'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.preferredDate) {
      newErrors.preferredDate = 'La fecha preferida es obligatoria';
    }
    if (!formData.preferredTime) {
      newErrors.preferredTime = 'La hora preferida es obligatoria';
    }
    if (!formData.reason.trim()) {
      newErrors.reason = 'El motivo de la consulta es obligatorio';
    }

    // Validate date is not in the past
    if (formData.preferredDate) {
      const selectedDate = new Date(formData.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.preferredDate = 'No puedes seleccionar una fecha pasada';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor completa todos los campos obligatorios correctamente');
      return;
    }

    addDentalAppointment({
      studentId: student.id,
      studentName: student.name,
      accountNumber: student.accountNumber,
      preferredDate: formData.preferredDate,
      preferredTime: formData.preferredTime,
      reason: formData.reason,
      priority: formData.priority as 'baja' | 'media' | 'alta',
      status: 'pendiente'
    });

    toast.success('Solicitud de cita odontológica enviada correctamente');
    
    // Reset form
    setFormData({
      preferredDate: '',
      preferredTime: '',
      reason: '',
      priority: 'media'
    });
    
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Get maximum date (3 months from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#004aad]">
            <Stethoscope className="w-5 h-5" />
            Solicitud de Cita Odontológica
          </DialogTitle>
          <DialogDescription>
            Agenda tu cita odontológica especificando tu disponibilidad y el motivo de consulta.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Info Display */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-[#004aad] mb-2">Información del Estudiante</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Nombre:</span>
                <p className="font-medium">{student.name}</p>
              </div>
              <div>
                <span className="text-gray-600">No. Cuenta:</span>
                <p className="font-medium">{student.accountNumber}</p>
              </div>
            </div>
          </div>

          {/* Preferred Date */}
          <div className="space-y-2">
            <Label htmlFor="preferredDate" className="after:content-['*'] after:ml-0.5 after:text-red-500 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Fecha preferida
            </Label>
            <Input
              id="preferredDate"
              type="date"
              value={formData.preferredDate}
              onChange={(e) => handleInputChange('preferredDate', e.target.value)}
              className={errors.preferredDate ? 'border-red-500' : ''}
              min={getMinDate()}
              max={getMaxDate()}
            />
            {errors.preferredDate && (
              <p className="text-sm text-red-600">{errors.preferredDate}</p>
            )}
            <p className="text-xs text-gray-500">
              Disponible desde mañana hasta 3 meses en adelante
            </p>
          </div>

          {/* Preferred Time */}
          <div className="space-y-2">
            <Label htmlFor="preferredTime" className="after:content-['*'] after:ml-0.5 after:text-red-500 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Hora preferida
            </Label>
            <Select value={formData.preferredTime} onValueChange={(value) => handleInputChange('preferredTime', value)}>
              <SelectTrigger className={errors.preferredTime ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecciona una hora" />
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
            {errors.preferredTime && (
              <p className="text-sm text-red-600">{errors.preferredTime}</p>
            )}
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="after:content-['*'] after:ml-0.5 after:text-red-500">
              Motivo de la consulta
            </Label>
            <Textarea
              id="reason"
              placeholder="Describe el motivo de tu consulta odontológica (dolor, revisión, limpieza, etc.)..."
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              className={errors.reason ? 'border-red-500' : ''}
              rows={4}
            />
            {errors.reason && (
              <p className="text-sm text-red-600">{errors.reason}</p>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Prioridad
            </Label>
            <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baja">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Baja - Revisión o limpieza
                  </div>
                </SelectItem>
                <SelectItem value="media">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    Media - Molestia leve
                  </div>
                </SelectItem>
                <SelectItem value="alta">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    Alta - Dolor fuerte o urgencia
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              La prioridad ayuda al odontólogo a programar las citas según la urgencia
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">Información importante:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Las citas están sujetas a disponibilidad del odontólogo</li>
              <li>• Recibirás confirmación por correo electrónico</li>
              <li>• Llega 15 minutos antes de tu cita</li>
              <li>• Trae tu carnet estudiantil</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#edba0d] hover:bg-[#d4a40b] text-white">
              <Stethoscope className="w-4 h-4 mr-2" />
              Enviar Solicitud
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}