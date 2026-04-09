import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Checkbox } from '../ui/checkbox';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { DentalAppointment, DentalTreatment, StaffMember } from '../../types';
import { 
  Stethoscope, Plus, Calendar, User, Clock, AlertTriangle, 
  FileText, CheckCircle, Eye, Save, X, Search, Filter, ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// Common dental treatment types
const TREATMENT_TYPES = [
  'Limpieza Dental',
  'Empaste/Obturación',
  'Endodoncia',
  'Extracción',
  'Corona Dental',
  'Blanqueamiento',
  'Ortodoncia',
  'Cirugía Oral',
  'Tratamiento de Encías',
  'Prótesis Dental'
];

// Common procedures
/*const COMMON_PROCEDURES = [
  'Limpieza supragingival',
  'Limpieza subgingival',
  'Pulido dental',
  'Aplicación de flúor',
  'Obturación con resina',
  'Obturación con amalgama',
  'Preparación de cavidad',
  'Anestesia local',
  'Radiografía periapical',
  'Radiografía panorámica',
  'Examen clínico',
  'Diagnóstico',
  'Instrucciones de higiene'
];*/

// Common materials
/*const COMMON_MATERIALS = [
  'Resina compuesta',
  'Amalgama dental',
  'Pasta profiláctica',
  'Flúor gel',
  'Anestesia lidocaína',
  'Algodón',
  'Gasas',
  'Eugenol',
  'Óxido de zinc',
  'Cemento temporal'
];*/

interface TreatmentFormData {
  appointmentId: string;
  treatmentType: string;
  treatmentDescription: string;
  diagnosis: string;
  proceduresPerformed: string[];
  materialsUsed: string[];
  duration: number;
  cost: number;
  requiresFollowUp: boolean;
  followUpDate: string;
  followUpInstructions: string;
  notes: string;
}

const initialFormData: TreatmentFormData = {
  appointmentId: '',
  treatmentType: '',
  treatmentDescription: '',
  diagnosis: '',
  proceduresPerformed: [],
  materialsUsed: [],
  duration: 0,
  cost: 0,
  requiresFollowUp: false,
  followUpDate: '',
  followUpInstructions: '',
  notes: ''
};

export function DentalTreatmentPage() {
  const { user } = useAuth();
  const { dentalAppointments, dentalTreatments, addDentalTreatment, updateDentalAppointment } = useData();
  const [selectedAppointment, setSelectedAppointment] = useState<DentalAppointment | null>(null);
  const [formData, setFormData] = useState<TreatmentFormData>(initialFormData);
  const [showTreatmentForm, setShowTreatmentForm] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState<DentalTreatment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { treatmentTypes } = useData();
  
  const staff = user?.data as StaffMember;
  const dentistId = staff.personalId;
  const dentistName = staff.name;

  // Get appointments assigned to current dentist
  const assignedAppointments = dentalAppointments.filter(
    appointment => appointment.assignedDentistId === dentistId
  );

  // Get treatments performed by current dentist
  const dentistTreatments = dentalTreatments.filter(
    treatment => treatment.dentistId === dentistId
  );

  // Filter treatments based on search and status
  const filteredTreatments = dentistTreatments.filter(treatment => {
    const matchesSearch = 
      treatment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treatment.accountNumber.includes(searchTerm) ||
      treatment.treatmentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treatment.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || treatment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStartTreatment = (appointment: DentalAppointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      ...initialFormData,
      appointmentId: appointment.id
    });
    setShowTreatmentForm(true);
  };

  const handleCancelTreatment = () => {
    setShowTreatmentForm(false);
    setSelectedAppointment(null);
    setFormData(initialFormData);
  };

  const handleFormChange = (field: keyof TreatmentFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProcedureToggle = (procedure: string) => {
    setFormData(prev => ({
      ...prev,
      proceduresPerformed: prev.proceduresPerformed.includes(procedure)
        ? prev.proceduresPerformed.filter(p => p !== procedure)
        : [...prev.proceduresPerformed, procedure]
    }));
  };

  const handleMaterialToggle = (material: string) => {
    setFormData(prev => ({
      ...prev,
      materialsUsed: prev.materialsUsed.includes(material)
        ? prev.materialsUsed.filter(m => m !== material)
        : [...prev.materialsUsed, material]
    }));
  };

  const handleSubmitTreatment = () => {
    if (!selectedAppointment) return;

    // Validate required fields
    if (!formData.treatmentType || !formData.diagnosis || !formData.treatmentDescription) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    if (formData.requiresFollowUp && !formData.followUpDate) {
      toast.error('Debes especificar la fecha de seguimiento');
      return;
    }

    // Create treatment record
    const treatmentData = {
      appointmentId: selectedAppointment.id,
      studentId: selectedAppointment.studentId,
      studentName: selectedAppointment.studentName,
      accountNumber: selectedAppointment.accountNumber,
      dentistId,
      dentistName,
      ...formData,
      status: 'completado' as const,
      completedAt: new Date().toISOString()
    };

    addDentalTreatment(treatmentData);

    // Update appointment status to completed
    updateDentalAppointment(selectedAppointment.id, {
      status: 'completada'
    });

    toast.success('Tratamiento registrado exitosamente');
    setShowTreatmentForm(false);
    setSelectedAppointment(null);
    setFormData(initialFormData);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-HN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-HN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'planificado': 'bg-blue-100 text-blue-800',
      'en_progreso': 'bg-yellow-100 text-yellow-800',
      'completado': 'bg-green-100 text-green-800',
      'cancelado': 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800'}>
        {status === 'en_progreso' ? 'En Progreso' : 
         status === 'completado' ? 'Completado' :
         status === 'cancelado' ? 'Cancelado' : 'Planificado'}
      </Badge>
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    toast.success('Filtros limpiados');
  };

  // If showing treatment form, render the form view
  if (showTreatmentForm && selectedAppointment) {
    return (
      <div className="space-y-6">
        {/* Header with Back Button */}
        <Card className="border-l-4 border-l-[#edba0d]">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={handleCancelTreatment}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </Button>
              <div>
                <CardTitle className="flex items-center gap-2 text-[#004aad]">
                  <Plus className="w-5 h-5" />
                  Registrar Tratamiento Odontológico
                </CardTitle>
                <CardDescription>
                  Completa la información del tratamiento realizado al paciente
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Patient Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#004aad]">Información del Paciente</CardTitle>
          </CardHeader>
          <CardContent className="bg-yellow-50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-sm text-gray-600">Nombre:</span>
                <p className="font-medium">{selectedAppointment.studentName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">No. Cuenta:</span>
                <p className="font-medium font-mono">{selectedAppointment.accountNumber}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Motivo de Consulta:</span>
                <p className="font-medium">{selectedAppointment.reason}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Prioridad:</span>
                <Badge className={getPriorityColor(selectedAppointment.priority)}>
                  {selectedAppointment.priority.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Treatment Form */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#004aad]">Información Básica del Tratamiento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="treatmentType" className="after:content-['*'] after:text-red-500 after:ml-1">
                  Tipo de Tratamiento
                </Label>
                <Select 
                  value={formData.treatmentType} 
                  onValueChange={(value) => handleFormChange('treatmentType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo de tratamiento" />
                  </SelectTrigger>
                  <SelectContent>
                    {TREATMENT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="treatmentDescription" className="after:content-['*'] after:text-red-500 after:ml-1">
                  Descripción del Tratamiento
                </Label>
                <Textarea
                  id="treatmentDescription"
                  placeholder="Describe detalladamente el tratamiento realizado..."
                  value={formData.treatmentDescription}
                  onChange={(e) => handleFormChange('treatmentDescription', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="diagnosis" className="after:content-['*'] after:text-red-500 after:ml-1">
                  Diagnóstico
                </Label>
                <Textarea
                  id="diagnosis"
                  placeholder="Diagnóstico clínico del paciente..."
                  value={formData.diagnosis}
                  onChange={(e) => handleFormChange('diagnosis', e.target.value)}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duración (minutos)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="45"
                    value={formData.duration || ''}
                    onChange={(e) => handleFormChange('duration', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Costo (L.)</Label>
                  <Input
                    id="cost"
                    type="text"
                    placeholder="150"
                    value={formData.cost || ''}
                    onChange={(e) => handleFormChange('cost', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Follow-up Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#004aad]">Seguimiento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="requiresFollowUp"
                checked={formData.requiresFollowUp}
                onCheckedChange={(checked) => handleFormChange('requiresFollowUp', checked)}
              />
              <Label htmlFor="requiresFollowUp">Este tratamiento requiere seguimiento</Label>
            </div>

            {formData.requiresFollowUp && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="followUpDate">Fecha de Seguimiento</Label>
                  <Input
                    id="followUpDate"
                    type="date"
                    value={formData.followUpDate}
                    onChange={(e) => handleFormChange('followUpDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="followUpInstructions">Instrucciones de Seguimiento</Label>
                  <Textarea
                    id="followUpInstructions"
                    placeholder="Instrucciones para el paciente..."
                    value={formData.followUpInstructions}
                    onChange={(e) => handleFormChange('followUpInstructions', e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#004aad]">Notas Adicionales</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Observaciones generales, recomendaciones, etc..."
              value={formData.notes}
              onChange={(e) => handleFormChange('notes', e.target.value)}
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pb-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancelTreatment}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancelar
          </Button>
          <Button
            onClick={handleSubmitTreatment}
            className="bg-[#edba0d] hover:bg-[#d4a40b] text-white flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Guardar Tratamiento
          </Button>
        </div>
      </div>
    );
  }

  // Default view - appointments list and history
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-[#edba0d]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#004aad]">
            <Stethoscope className="w-5 h-5" />
            Registro de Tratamientos Odontológicos
          </CardTitle>
          <CardDescription>
            Gestiona y registra los tratamientos dentales realizados a los estudiantes
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas Pendientes</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedAppointments.length}</div>
            <p className="text-xs text-muted-foreground">Asignadas a ti</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tratamientos Realizados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dentistTreatments.filter(t => t.status === 'completado').length}
            </div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seguimientos Programados</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dentistTreatments.filter(t => t.requiresFollowUp && t.status === 'completado').length}
            </div>
            <p className="text-xs text-muted-foreground">Requieren seguimiento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Atendidos</CardTitle>
            <User className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(dentistTreatments.map(t => t.studentId)).size}
            </div>
            <p className="text-xs text-muted-foreground">Pacientes únicos</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Citas Confirmadas Pendientes de Tratamiento</CardTitle>
          <CardDescription>
            Citas asignadas que están listas para registrar el tratamiento realizado
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assignedAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No tienes citas pendientes de tratamiento</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>No. Cuenta</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Fecha/Hora</TableHead>
                  <TableHead>Fecha Solicitud</TableHead>
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
                    <TableCell className="max-w-48">
                      <p className="truncate" title={appointment.reason}>
                        {appointment.reason}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(appointment.priority)}>
                        {appointment.priority.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {appointment.preferredDate}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {appointment.preferredTime}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDate(appointment.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => handleStartTreatment(appointment)}
                        className="bg-[#edba0d] hover:bg-[#d4a40b] text-white"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Registrar Tratamiento
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Treatment History Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros - Historial de Tratamientos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Paciente, cuenta o tipo de tratamiento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="planificado">Planificado</SelectItem>
                  <SelectItem value="en_progreso">En Progreso</SelectItem>
                  <SelectItem value="completado">Completado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
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

      {/* Treatment History */}
      <Card>
        <CardHeader>
          <CardTitle>
            Historial de Tratamientos ({filteredTreatments.length} de {dentistTreatments.length})
          </CardTitle>
          <CardDescription>
            Tratamientos dentales realizados por ti
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTreatments.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron tratamientos con los filtros aplicados</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>No. Cuenta</TableHead>
                  <TableHead>Tipo de Tratamiento</TableHead>
                  <TableHead>Diagnóstico</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Seguimiento</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTreatments.map((treatment) => (
                  <TableRow key={treatment.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {treatment.studentName}
                    </TableCell>
                    <TableCell className="font-mono">
                      {treatment.accountNumber}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{treatment.treatmentType}</Badge>
                    </TableCell>
                    <TableCell className="max-w-48">
                      <p className="truncate" title={treatment.diagnosis}>
                        {treatment.diagnosis}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {treatment.duration} min
                      </div>
                    </TableCell>
                    <TableCell>
                      {treatment.requiresFollowUp ? (
                        <Badge className="bg-orange-100 text-orange-800">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Requerido
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">
                          No requerido
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {formatDateTime(treatment.createdAt)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(treatment.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedTreatment(treatment)}
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
    </div>
  );
}