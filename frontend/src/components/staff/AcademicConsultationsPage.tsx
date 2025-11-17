import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StaffMember, AcademicConsultation } from '../../types';
import { 
  BookOpen, Plus, User, Calendar, CheckCircle, Clock, 
  Edit, Eye, FileText, AlertTriangle 
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { formatDateTime } from '../../utils/dateHelpers';
import { getStatusColor } from '../../utils/statusHelpers';

interface EditConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultation: AcademicConsultation | null;
  onSave: (consultationData: any) => void;
}

function EditConsultationModal({ isOpen, onClose, consultation, onSave }: EditConsultationModalProps) {
  const [editData, setEditData] = useState({
    consultationType: '',
    description: '',
    recommendations: '',
    followUpRequired: false
  });

  const consultationTypes = [
    'Planificación Académica',
    'Cambio de Carrera',
    'Problemas de Rendimiento',
    'Orientación Vocacional',
    'Trámites Académicos',
    'Becas y Ayudas',
    'Intercambios',
    'Práctica Profesional',
    'Tesis/Trabajo de Graduación',
    'Otro'
  ];

  React.useEffect(() => {
    if (consultation) {
      setEditData({
        consultationType: consultation.consultationType,
        description: consultation.description,
        recommendations: consultation.recommendations,
        followUpRequired: consultation.followUpRequired
      });
    }
  }, [consultation]);

  const handleSave = () => {
    if (!editData.consultationType) {
      toast.error('Debes seleccionar el tipo de consulta');
      return;
    }
    
    if (!editData.description.trim()) {
      toast.error('Debes describir la consulta');
      return;
    }
    
    if (!editData.recommendations.trim()) {
      toast.error('Debes proporcionar recomendaciones');
      return;
    }

    onSave(editData);
    onClose();
  };

  if (!consultation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-[#004aad]" />
            Editar Consulta Académica
          </DialogTitle>
          <DialogDescription>
            Modifica los detalles de la consulta académica realizada
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Student Info (Read-only) */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-[#004aad] mb-2">Información del Estudiante</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Nombre:</span>
                <p className="font-medium">{consultation.studentName}</p>
              </div>
              <div>
                <span className="text-gray-600">No. Cuenta:</span>
                <p className="font-medium">{consultation.accountNumber}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tipo de Consulta</Label>
            <Select value={editData.consultationType} onValueChange={(value) => 
              setEditData(prev => ({ ...prev, consultationType: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                {consultationTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Descripción de la Consulta</Label>
            <Textarea
              placeholder="Describe detalladamente la consulta realizada..."
              value={editData.description}
              onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Recomendaciones y Orientaciones</Label>
            <Textarea
              placeholder="Describe las recomendaciones y orientaciones proporcionadas..."
              value={editData.recommendations}
              onChange={(e) => setEditData(prev => ({ ...prev, recommendations: e.target.value }))}
              rows={4}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="editFollowUp"
              checked={editData.followUpRequired}
              onCheckedChange={(checked) => 
                setEditData(prev => ({ ...prev, followUpRequired: !!checked }))
              }
            />
            <Label htmlFor="editFollowUp">Esta consulta requiere seguimiento</Label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-[#004aad] hover:bg-[#003687] text-white">
            <CheckCircle className="w-4 h-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function AcademicConsultationsPage() {
  const { user } = useAuth();
  const { academicConsultations, addAcademicConsultation, updateAcademicConsultation } = useData();
  const staff = user?.data as StaffMember;

  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<AcademicConsultation | null>(null);
  const [formData, setFormData] = useState({
    studentName: '',
    accountNumber: '',
    consultationType: '',
    description: '',
    recommendations: '',
    followUpRequired: false
  });

  // Mock student data for search
  const mockStudents = [
    { accountNumber: '20191234567', name: 'María Elena Rodríguez', career: 'Ingeniería Industrial' },
    { accountNumber: '20201234567', name: 'Carlos Antonio López', career: 'Administración de Empresas' },
    { accountNumber: '20211234567', name: 'Ana Patricia Martínez', career: 'Psicología' },
    { accountNumber: '20221234567', name: 'José Luis Hernández', career: 'Ingeniería Civil' },
    { accountNumber: '20231234567', name: 'Laura Isabel García', career: 'Medicina' }
  ];

  const myConsultations = academicConsultations.filter(c => c.advisorId === staff.id);

  const consultationTypes = [
    'Planificación Académica',
    'Cambio de Carrera',
    'Problemas de Rendimiento',
    'Orientación Vocacional',
    'Trámites Académicos',
    'Becas y Ayudas',
    'Intercambios',
    'Práctica Profesional',
    'Tesis/Trabajo de Graduación',
    'Otro'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.studentName || !formData.accountNumber) {
      toast.error('Debes proporcionar la información del estudiante');
      return;
    }
    
    if (!formData.consultationType) {
      toast.error('Debes seleccionar el tipo de consulta');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('Debes describir la consulta');
      return;
    }
    
    if (!formData.recommendations.trim()) {
      toast.error('Debes proporcionar recomendaciones');
      return;
    }

    addAcademicConsultation({
      studentId: 'student-' + Date.now(),
      studentName: formData.studentName,
      accountNumber: formData.accountNumber,
      consultationType: formData.consultationType,
      description: formData.description,
      advisorId: staff.id,
      advisorName: staff.name,
      recommendations: formData.recommendations,
      followUpRequired: formData.followUpRequired,
      status: 'completada',
      completedAt: new Date().toISOString()
    });

    toast.success('Consulta académica registrada correctamente');
    setFormData({
      studentName: '',
      accountNumber: '',
      consultationType: '',
      description: '',
      recommendations: '',
      followUpRequired: false
    });
    setShowForm(false);
  };

  const handleStudentSelect = (accountNumber: string) => {
    const student = mockStudents.find(s => s.accountNumber === accountNumber);
    if (student) {
      setFormData(prev => ({
        ...prev,
        studentName: student.name,
        accountNumber: student.accountNumber
      }));
    }
  };

  const handleEditConsultation = (consultation: AcademicConsultation) => {
    setSelectedConsultation(consultation);
    setShowEditModal(true);
  };

  const handleEditSave = (consultationData: any) => {
    if (selectedConsultation) {
      updateAcademicConsultation(selectedConsultation.id, consultationData);
      toast.success('Consulta académica actualizada correctamente');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-[#004aad]">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2 text-[#004aad]">
                <BookOpen className="w-5 h-5" />
                Consultas Académicas
              </CardTitle>
              <CardDescription>
                Registra y gestiona las orientaciones académicas proporcionadas a los estudiantes
              </CardDescription>
            </div>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-[#004aad] hover:bg-[#003687] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Consulta
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Consultas</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myConsultations.length}</div>
            <p className="text-xs text-muted-foreground">Consultas realizadas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Este Mes</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {myConsultations.filter(c => {
                const consultationDate = new Date(c.createdAt);
                const now = new Date();
                return consultationDate.getMonth() === now.getMonth() && 
                       consultationDate.getFullYear() === now.getFullYear();
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">Consultas del mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seguimientos</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {myConsultations.filter(c => c.followUpRequired).length}
            </div>
            <p className="text-xs text-muted-foreground">Requieren seguimiento</p>
          </CardContent>
        </Card>
      </div>

      {/* New Consultation Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Registrar Nueva Consulta Académica</CardTitle>
            <CardDescription>
              Documenta la consulta académica realizada con el estudiante
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Student Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Número de Cuenta del Estudiante</Label>
                  <Select onValueChange={handleStudentSelect} value={formData.accountNumber}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el estudiante" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockStudents.map((student) => (
                        <SelectItem key={student.accountNumber} value={student.accountNumber}>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-xs text-gray-500">{student.accountNumber} - {student.career}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tipo de Consulta</Label>
                  <Select value={formData.consultationType} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, consultationType: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {consultationTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Consultation Description */}
              <div className="space-y-2">
                <Label>Descripción de la Consulta</Label>
                <Textarea
                  placeholder="Describe detalladamente la consulta realizada..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>

              {/* Recommendations */}
              <div className="space-y-2">
                <Label>Recomendaciones y Orientaciones</Label>
                <Textarea
                  placeholder="Describe las recomendaciones y orientaciones proporcionadas..."
                  value={formData.recommendations}
                  onChange={(e) => setFormData(prev => ({ ...prev, recommendations: e.target.value }))}
                  rows={4}
                />
              </div>

              {/* Follow-up Required */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="followUp"
                  checked={formData.followUpRequired}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, followUpRequired: !!checked }))
                  }
                />
                <Label htmlFor="followUp">Esta consulta requiere seguimiento</Label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-[#004aad] hover:bg-[#003687] text-white">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Registrar Consulta
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Consultations History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Consultas Académicas</CardTitle>
          <CardDescription>
            Registro de todas las consultas académicas realizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {myConsultations.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No has registrado consultas académicas aún</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>No. Cuenta</TableHead>
                  <TableHead>Tipo de Consulta</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Seguimiento</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myConsultations.map((consultation) => (
                  <TableRow key={consultation.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {consultation.studentName}
                    </TableCell>
                    <TableCell className="font-mono">
                      {consultation.accountNumber}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {consultation.consultationType}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-64">
                      <p className="truncate" title={consultation.description}>
                        {consultation.description}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(consultation.createdAt).toLocaleDateString('es-HN')}
                      </div>
                    </TableCell>
                    <TableCell>
                      {consultation.followUpRequired ? (
                        <Badge className="bg-orange-100 text-orange-800">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Requerido
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-600">
                          No requerido
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(consultation.status)}>
                        {consultation.status === 'completada' ? 'Completada' : consultation.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditConsultation(consultation)}
                        className="text-[#004aad] border-[#004aad] hover:bg-[#004aad] hover:text-white"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <EditConsultationModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        consultation={selectedConsultation}
        onSave={handleEditSave}
      />
    </div>
  );
}