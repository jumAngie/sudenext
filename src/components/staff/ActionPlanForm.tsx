import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { SupportSession } from '../../types';
import { Plus, Minus, Save } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { getMinDate } from '../../utils/dateHelpers';

interface ActionPlanFormProps {
  session: SupportSession | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function ActionPlanForm({ session, isOpen, onClose, onSubmit }: ActionPlanFormProps) {
  const [formData, setFormData] = useState({
    sessionSummary: '',
    objectives: [''],
    suggestedActivities: [''],
    followUpDate: '',
    additionalObservations: ''
  });

  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }));
  };

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const updateObjective = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => i === index ? value : obj)
    }));
  };

  const addActivity = () => {
    setFormData(prev => ({
      ...prev,
      suggestedActivities: [...prev.suggestedActivities, '']
    }));
  };

  const removeActivity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      suggestedActivities: prev.suggestedActivities.filter((_, i) => i !== index)
    }));
  };

  const updateActivity = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      suggestedActivities: prev.suggestedActivities.map((act, i) => i === index ? value : act)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.sessionSummary.trim()) {
      toast.error('El resumen de la sesión es obligatorio');
      return;
    }
    
    const validObjectives = formData.objectives.filter(obj => obj.trim());
    if (validObjectives.length === 0) {
      toast.error('Debes agregar al menos un objetivo');
      return;
    }

    const validActivities = formData.suggestedActivities.filter(act => act.trim());
    if (validActivities.length === 0) {
      toast.error('Debes agregar al menos una actividad sugerida');
      return;
    }

    if (!formData.followUpDate) {
      toast.error('La fecha de seguimiento es obligatoria');
      return;
    }

    onSubmit({
      ...formData,
      objectives: validObjectives,
      suggestedActivities: validActivities
    });

    setFormData({
      sessionSummary: '',
      objectives: [''],
      suggestedActivities: [''],
      followUpDate: '',
      additionalObservations: ''
    });
  };

  if (!session) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Plan de Acción - {session.studentName}</DialogTitle>
          <DialogDescription>
            Documenta los resultados de la sesión y define el plan de seguimiento
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Session Summary */}
          <div className="space-y-2">
            <Label htmlFor="sessionSummary">Resumen de la sesión *</Label>
            <Textarea
              id="sessionSummary"
              placeholder="Describe lo que se trabajó en la sesión..."
              value={formData.sessionSummary}
              onChange={(e) => setFormData(prev => ({ ...prev, sessionSummary: e.target.value }))}
              rows={4}
            />
          </div>

          {/* Objectives */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Objetivos acordados con el estudiante *</Label>
              <Button type="button" onClick={addObjective} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Agregar
              </Button>
            </div>
            {formData.objectives.map((objective, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Objetivo ${index + 1}`}
                  value={objective}
                  onChange={(e) => updateObjective(index, e.target.value)}
                  className="flex-1"
                />
                {formData.objectives.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeObjective(index)}
                    size="sm"
                    variant="outline"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Activities */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Actividades sugeridas *</Label>
              <Button type="button" onClick={addActivity} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Agregar
              </Button>
            </div>
            {formData.suggestedActivities.map((activity, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Actividad ${index + 1}`}
                  value={activity}
                  onChange={(e) => updateActivity(index, e.target.value)}
                  className="flex-1"
                />
                {formData.suggestedActivities.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeActivity(index)}
                    size="sm"
                    variant="outline"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Follow-up Date */}
          <div className="space-y-2">
            <Label htmlFor="followUpDate">Fecha sugerida para seguimiento *</Label>
            <Input
              id="followUpDate"
              type="date"
              value={formData.followUpDate}
              onChange={(e) => setFormData(prev => ({ ...prev, followUpDate: e.target.value }))}
              min={getMinDate()}
            />
          </div>

          {/* Additional Observations */}
          <div className="space-y-2">
            <Label htmlFor="additionalObservations">Observaciones adicionales (opcional)</Label>
            <Textarea
              id="additionalObservations"
              placeholder="Observaciones del profesional..."
              value={formData.additionalObservations}
              onChange={(e) => setFormData(prev => ({ ...prev, additionalObservations: e.target.value }))}
              rows={3}
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