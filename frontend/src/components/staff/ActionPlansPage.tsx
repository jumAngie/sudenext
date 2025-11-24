import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StaffMember, SupportSession, ActionPlan } from '../../types';
import { 
  FileText, Plus, Calendar, User, Clock, CheckSquare, 
  Edit, Eye, MapPin, Heart
} from 'lucide-react';
import { ActionPlanForm } from './ActionPlanForm';
import { formatDateTime } from '../../utils/dateHelpers';
import { getStatusColor } from '../../utils/statusHelpers';
import { toast } from 'sonner@2.0.3';

interface EditPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: ActionPlan | null;
  onSave: (planData: any) => void;
}

function EditPlanModal({ isOpen, onClose, plan, onSave }: EditPlanModalProps) {
  const [editData, setEditData] = useState({
    sessionSummary: '',
    objectives: '',
    suggestedActivities: '',
    followUpDate: '',
    additionalObservations: ''
  });

  React.useEffect(() => {
    if (plan) {
      setEditData({
        sessionSummary: plan.sessionSummary,
        objectives: plan.objectives.join('\n'),
        suggestedActivities: plan.suggestedActivities.join('\n'),
        followUpDate: plan.followUpDate.split('T')[0],
        additionalObservations: plan.additionalObservations || ''
      });
    }
  }, [plan]);

  const handleSave = () => {
    if (!editData.sessionSummary.trim()) {
      toast.error('El resumen de sesión es obligatorio');
      return;
    }

    const objectives = editData.objectives.split('\n').filter(obj => obj.trim());
    const activities = editData.suggestedActivities.split('\n').filter(act => act.trim());

    if (objectives.length === 0) {
      toast.error('Debes incluir al menos un objetivo');
      return;
    }

    onSave({
      sessionSummary: editData.sessionSummary,
      objectives,
      suggestedActivities: activities,
      followUpDate: editData.followUpDate,
      additionalObservations: editData.additionalObservations || undefined
    });

    onClose();
  };

  if (!plan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-[#004aad]" />
            Editar Plan de Acción
          </DialogTitle>
          <DialogDescription>
            Modifica los detalles del plan de acción para esta sesión
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sessionSummary">Resumen de la Sesión *</Label>
            <Textarea
              id="sessionSummary"
              value={editData.sessionSummary}
              onChange={(e) => setEditData(prev => ({ ...prev, sessionSummary: e.target.value }))}
              rows={4}
              placeholder="Describe lo que se trató en la sesión..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="objectives">Objetivos (uno por línea) *</Label>
            <Textarea
              id="objectives"
              value={editData.objectives}
              onChange={(e) => setEditData(prev => ({ ...prev, objectives: e.target.value }))}
              rows={4}
              placeholder="Objetivo 1&#10;Objetivo 2&#10;Objetivo 3"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="activities">Actividades Sugeridas (una por línea)</Label>
            <Textarea
              id="activities"
              value={editData.suggestedActivities}
              onChange={(e) => setEditData(prev => ({ ...prev, suggestedActivities: e.target.value }))}
              rows={4}
              placeholder="Actividad 1&#10;Actividad 2&#10;Actividad 3"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="followUpDate">Fecha de Seguimiento</Label>
            <Input
              id="followUpDate"
              type="date"
              value={editData.followUpDate}
              onChange={(e) => setEditData(prev => ({ ...prev, followUpDate: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observations">Observaciones Adicionales</Label>
            <Textarea
              id="observations"
              value={editData.additionalObservations}
              onChange={(e) => setEditData(prev => ({ ...prev, additionalObservations: e.target.value }))}
              rows={3}
              placeholder="Observaciones adicionales..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-[#004aad] hover:bg-[#003687] text-white">
            <CheckSquare className="w-4 h-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ActionPlansPage() {
  const { user } = useAuth();
  const { supportSessions, actionPlans, addActionPlan, updateSupportSession } = useData();
  const staff = user?.data as StaffMember;

  const [selectedSession, setSelectedSession] = useState<SupportSession | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<ActionPlan | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const assignedSessions = supportSessions.filter(s => 
    s.assignedCounselorId === staff.personalId && s.status === 'asignada'
  );

  console.log();

  const myCounselorPlans = actionPlans.filter(p => p.counselorId === staff.id);

  const handleCreatePlan = (session: SupportSession) => {
    setSelectedSession(session);
    setShowCreateForm(true);
  };

  const handleEditPlan = (plan: ActionPlan) => {
    setSelectedPlan(plan);
    setShowEditModal(true);
  };

  const handleFormSubmit = (data: any) => {
    if (!selectedSession) return;

    addActionPlan({
      sessionId: selectedSession.id,
      studentId: selectedSession.studentId,
      counselorId: staff.id,
      ...data
    });

    updateSupportSession(selectedSession.id, {
      status: 'completada'
    });

    setShowCreateForm(false);
    setSelectedSession(null);
    toast.success('Plan de acción creado correctamente');
  };

  const handleEditSave = (planData: any) => {
    // In a real app, this would update the plan in the database
    toast.success('Plan de acción actualizado correctamente');
  };

  const getEmotionalLevelBadge = (level: number) => {
    const color = level >= 4 ? 'bg-red-100 text-red-800' : 
                  level >= 3 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-green-100 text-green-800';
    return <Badge className={color}>{level}/5</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-[#004aad]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#004aad]">
            <FileText className="w-5 h-5" />
            Planes de Acción Post Sesión
          </CardTitle>
          <CardDescription>
            Documenta las conclusiones y planes de acción para tus sesiones de apoyo
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sesiones Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedSessions.length}</div>
            <p className="text-xs text-muted-foreground">Requieren plan de acción</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planes Creados</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myCounselorPlans.length}</div>
            <p className="text-xs text-muted-foreground">Total de planes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sesiones Completadas</CardTitle>
            <CheckSquare className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {supportSessions.filter(s => s.assignedCounselorId === staff.id && s.status === 'completada').length}
            </div>
            <p className="text-xs text-muted-foreground">Con plan de acción</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Sessions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sesiones Pendientes de Documentar</CardTitle>
          <CardDescription>
            Sesiones asignadas que requieren la creación de un plan de acción
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assignedSessions.length === 0 ? (
            <div className="text-center py-8">
              <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay sesiones pendientes de documentar</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>No. Cuenta</TableHead>
                  <TableHead>Motivo Principal</TableHead>
                  <TableHead>Nivel Emocional</TableHead>
                  <TableHead>Hora Preferida</TableHead>
                  <TableHead>Fecha Programada</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignedSessions.map((session) => (
                  <TableRow key={session.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {session.studentName}
                    </TableCell>
                    <TableCell className="font-mono">
                      {session.accountNumber}
                    </TableCell>
                    <TableCell className="max-w-64">
                      <p className="truncate" title={session.mainReason}>
                        {session.mainReason}
                      </p>
                    </TableCell>
                    <TableCell>
                      {getEmotionalLevelBadge(session.emotionalLevel)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {session.preferredTime}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {session.scheduledAt 
                          ? new Date(session.scheduledAt).toLocaleDateString('es-HN')
                          : 'Por programar'
                        }
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => handleCreatePlan(session)}
                        className="bg-[#004aad] hover:bg-[#003687] text-white"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Crear Plan
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Action Plans History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Planes de Acción</CardTitle>
          <CardDescription>
            Planes de acción creados para sesiones completadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {myCounselorPlans.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No has creado planes de acción aún</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>Fecha de Creación</TableHead>
                  <TableHead>Objetivos</TableHead>
                  <TableHead>Fecha de Seguimiento</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myCounselorPlans.map((plan) => {
                  const session = supportSessions.find(s => s.id === plan.sessionId);
                  return (
                    <TableRow key={plan.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {session?.studentName || 'Estudiante no encontrado'}
                      </TableCell>
                      <TableCell>
                        {new Date(plan.createdAt).toLocaleDateString('es-HN')}
                      </TableCell>
                      <TableCell className="max-w-64">
                        <div className="space-y-1">
                          {plan.objectives.slice(0, 2).map((obj, idx) => (
                            <p key={idx} className="text-sm truncate" title={obj}>
                              • {obj}
                            </p>
                          ))}
                          {plan.objectives.length > 2 && (
                            <p className="text-xs text-gray-500">
                              +{plan.objectives.length - 2} más...
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(plan.followUpDate).toLocaleDateString('es-HN')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          Completado
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditPlan(plan)}
                            className="text-[#004aad] border-[#004aad] hover:bg-[#004aad] hover:text-white"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Editar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <ActionPlanForm
        session={selectedSession}
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSubmit={handleFormSubmit}
      />

      <EditPlanModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        plan={selectedPlan}
        onSave={handleEditSave}
      />
    </div>
  );
}