import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { SupportSession } from '../../types';
import { Save } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { getMinDate } from '../../utils/dateHelpers';

interface ActionPlanFormProps {
  session: SupportSession | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: any) => void; // aquí enviarás el payload directo al SP
}

export function ActionPlanForm({ session, isOpen, onClose, onSubmit }: ActionPlanFormProps) {
  const [formData, setFormData] = useState({
    sessionSummary: "",
    objective: "",
    suggestedActivity: "",
    followUpDate: "",
    observation: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.sessionSummary.trim()) {
      toast.error("El resumen de la sesión es obligatorio.");
      return;
    }
    if (!formData.objective.trim()) {
      toast.error("El objetivo es obligatorio.");
      return;
    }
    if (!formData.suggestedActivity.trim()) {
      toast.error("La actividad sugerida es obligatoria.");
      return;
    }
    if (!formData.followUpDate) {
      toast.error("La fecha de seguimiento es obligatoria.");
      return;
    }
    if (!formData.observation.trim()) {
      toast.error("La observación es obligatoria.");
      return;
    }

    onSubmit({
      pla_ResumenSesion: formData.sessionSummary,
      pla_Objetivo: formData.objective,
      pla_ActividadSug: formData.suggestedActivity,
      pla_FechaSeguimiento: formData.followUpDate,
      pla_Observacion: formData.observation
    });

    // Limpiar formulario
    setFormData({
      sessionSummary: "",
      objective: "",
      suggestedActivity: "",
      followUpDate: "",
      observation: ""
    });
  };

  if (!session) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Plan de Acción - {session.studentName}</DialogTitle>
          <DialogDescription>
            Documenta los resultados de la sesión y crea un plan de seguimiento.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Resumen de Sesión */}
          <div className="space-y-2">
            <Label>Resumen de la sesión *</Label>
            <Textarea
              rows={4}
              placeholder="Describe lo trabajado en la sesión..."
              value={formData.sessionSummary}
              onChange={(e) =>
                setFormData({ ...formData, sessionSummary: e.target.value })
              }
            />
          </div>

          {/* Objetivo */}
          <div className="space-y-2">
            <Label>Objetivo *</Label>
            <Input
              placeholder="Objetivo principal de seguimiento"
              value={formData.objective}
              onChange={(e) =>
                setFormData({ ...formData, objective: e.target.value })
              }
            />
          </div>

          {/* Actividad sugerida */}
          <div className="space-y-2">
            <Label>Actividad sugerida *</Label>
            <Input
              placeholder="Ej: Realizar ejercicios de respiración diaria"
              value={formData.suggestedActivity}
              onChange={(e) =>
                setFormData({ ...formData, suggestedActivity: e.target.value })
              }
            />
          </div>

          {/* Fecha de seguimiento */}
          <div className="space-y-2">
            <Label>Fecha de seguimiento *</Label>
            <Input
              type="date"
              min={getMinDate()}
              value={formData.followUpDate}
              onChange={(e) =>
                setFormData({ ...formData, followUpDate: e.target.value })
              }
            />
          </div>

          {/* Observaciones */}
          <div className="space-y-2">
            <Label>Observaciones *</Label>
            <Textarea
              rows={3}
              placeholder="Notas u observaciones sobre la sesión"
              value={formData.observation}
              onChange={(e) =>
                setFormData({ ...formData, observation: e.target.value })
              }
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#004aad] hover:bg-[#003687]">
              <Save className="w-4 h-4 mr-2" />
              Guardar Plan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
