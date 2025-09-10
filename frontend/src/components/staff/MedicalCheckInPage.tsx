import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StaffMember, MedicalCheckIn } from '../../types';
import { 
  Users, Clock, CheckCircle, X, Search, UserX, 
  Stethoscope, FileText, Calendar, Eye, Edit 
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { formatDateTime } from '../../utils/dateHelpers';

// Mock data for arriving students
const generateMockArrivals = () => {
  const mockStudents = [
    { accountNumber: '20191234567', name: 'María Elena Rodríguez', career: 'Medicina' },
    { accountNumber: '20201234568', name: 'Carlos Antonio López', career: 'Ingeniería' },
    { accountNumber: '20211234569', name: 'Ana Patricia Martínez', career: 'Administración' },
    { accountNumber: '20221234570', name: 'José Luis Hernández', career: 'Derecho' },
    { accountNumber: '20231234571', name: 'Laura Isabel García', career: 'Psicología' },
    { accountNumber: '20191234572', name: 'Roberto Carlos Mendoza', career: 'Economía' },
    { accountNumber: '20201234573', name: 'Sofía Alejandra Torres', career: 'Enfermería' },
    { accountNumber: '20211234574', name: 'Diego Fernando Morales', career: 'Odontología' },
    { accountNumber: '20221234575', name: 'Carmen Elizabeth Flores', career: 'Arquitectura' },
    { accountNumber: '20231234576', name: 'Miguel Ángel Vargas', career: 'Sistemas' }
  ];

  return mockStudents.map((student, index) => ({
    id: `arrival-${Date.now()}-${index}`,
    studentId: `student-${student.accountNumber}`,
    studentName: student.name,
    accountNumber: student.accountNumber,
    career: student.career,
    arrivalNumber: Math.floor(Math.random() * 900) + 100, // Random 3-digit number
    arrivalTime: new Date(Date.now() - Math.random() * 3600000).toISOString(), // Random time in last hour
    status: Math.random() > 0.3 ? 'esperando' : 'atendido', // 70% waiting, 30% attended
    diagnosis: Math.random() > 0.7 ? 'Consulta general completada' : undefined,
    priority: Math.random() > 0.8 ? 'alta' : Math.random() > 0.5 ? 'media' : 'baja'
  }));
};

interface DiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
  onSave: (diagnosis: string, status: string) => void;
}

function DiagnosisModal({ isOpen, onClose, patient, onSave }: DiagnosisModalProps) {
  const [diagnosis, setDiagnosis] = useState('');
  const [status, setStatus] = useState('atendido');
  const [recommendations, setRecommendations] = useState('');

  const handleSave = () => {
    if (!diagnosis.trim()) {
      toast.error('El diagnóstico es obligatorio');
      return;
    }

    const fullDiagnosis = `${diagnosis}${recommendations ? `\n\nRecomendaciones: ${recommendations}` : ''}`;
    onSave(fullDiagnosis, status);
    setDiagnosis('');
    setRecommendations('');
    onClose();
  };

  if (!patient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-[#004aad]" />
            Asignar Diagnóstico - Llegada #{patient?.arrivalNumber}
          </DialogTitle>
          <DialogDescription>
            Registra el diagnóstico médico para el paciente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-[#004aad] mb-3">Información del Paciente</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Nombre:</span>
                <p className="font-medium">{patient?.studentName}</p>
              </div>
              <div>
                <span className="text-gray-600">No. Cuenta:</span>
                <p className="font-medium">{patient?.accountNumber}</p>
              </div>
              <div>
                <span className="text-gray-600">Carrera:</span>
                <p className="font-medium">{patient?.career}</p>
              </div>
              <div>
                <span className="text-gray-600">Hora de Llegada:</span>
                <p className="font-medium">
                  {new Date(patient?.arrivalTime).toLocaleTimeString('es-HN', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <span className="text-gray-600">Prioridad:</span>
              <Badge className={`ml-2 ${
                patient?.priority === 'alta' ? 'bg-red-100 text-red-800' :
                patient?.priority === 'media' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {patient?.priority?.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Diagnosis Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnóstico Principal *</Label>
              <Textarea
                id="diagnosis"
                placeholder="Ingresa el diagnóstico médico principal..."
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recommendations">Recomendaciones y Tratamiento</Label>
              <Textarea
                id="recommendations"
                placeholder="Recomendaciones, medicamentos, citas de seguimiento, etc..."
                value={recommendations}
                onChange={(e) => setRecommendations(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Estado de la Consulta</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="atendido">Consulta Completada</SelectItem>
                  <SelectItem value="referido">Referido a Especialista</SelectItem>
                  <SelectItem value="seguimiento">Requiere Seguimiento</SelectItem>
                  <SelectItem value="no_asistio">No Asistió</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-[#004aad] hover:bg-[#003687] text-white"
            >
              <FileText className="w-4 h-4 mr-2" />
              Guardar Diagnóstico
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function MedicalCheckInPage() {
  const { user } = useAuth();
  const { medicalCheckIns, addMedicalCheckIn } = useData();
  const staff = user?.data as StaffMember;

  const [arrivals, setArrivals] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Initialize mock arrivals on component mount
  useEffect(() => {
    setArrivals(generateMockArrivals());
  }, []);

  const filteredArrivals = arrivals.filter(arrival =>
    arrival.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    arrival.accountNumber.includes(searchTerm) ||
    arrival.arrivalNumber.toString().includes(searchTerm)
  );

  const todayCheckIns = medicalCheckIns.filter(checkIn => {
    const checkInDate = new Date(checkIn.createdAt);
    const today = new Date();
    return checkInDate.toDateString() === today.toDateString();
  });

  const waitingCount = arrivals.filter(a => a.status === 'esperando').length;
  const attendedCount = arrivals.filter(a => a.status === 'atendido').length;

  const handleAssignDiagnosis = (patient: any) => {
    setSelectedPatient(patient);
    setShowDiagnosisModal(true);
  };

  const handleSaveDiagnosis = (diagnosis: string, status: string) => {
    if (!selectedPatient) return;

    // Update arrival status
    setArrivals(prev => 
      prev.map(arrival => 
        arrival.id === selectedPatient.id 
          ? { ...arrival, diagnosis, status, attendedAt: new Date().toISOString() }
          : arrival
      )
    );

    // Add to medical check-ins
    addMedicalCheckIn({
      studentId: selectedPatient.studentId,
      studentName: selectedPatient.studentName,
      accountNumber: selectedPatient.accountNumber,
      arrivalTime: new Date(selectedPatient.arrivalTime).toTimeString().substring(0, 5),
      diagnosis,
      attended: status !== 'no_asistio',
      doctorId: staff.id,
      doctorName: staff.name,
      arrivalNumber: selectedPatient.arrivalNumber
    });

    toast.success('Diagnóstico registrado correctamente');
    setSelectedPatient(null);
  };

  const handleViewDetails = (patient: any) => {
    // For viewing existing diagnoses
    toast.info(`Consultando detalles de ${patient.studentName}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'esperando':
        return <Badge className="bg-yellow-100 text-yellow-800">Esperando</Badge>;
      case 'atendido':
        return <Badge className="bg-green-100 text-green-800">Atendido</Badge>;
      case 'referido':
        return <Badge className="bg-blue-100 text-blue-800">Referido</Badge>;
      case 'seguimiento':
        return <Badge className="bg-purple-100 text-purple-800">Seguimiento</Badge>;
      case 'no_asistio':
        return <Badge className="bg-red-100 text-red-800">No Asistió</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'alta':
        return <Badge className="bg-red-100 text-red-800">🔴 Alta</Badge>;
      case 'media':
        return <Badge className="bg-yellow-100 text-yellow-800">🟡 Media</Badge>;
      case 'baja':
        return <Badge className="bg-green-100 text-green-800">🟢 Baja</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-[#004aad]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#004aad]">
            <Stethoscope className="w-5 h-5" />
            Portal del Médico General
          </CardTitle>
          <CardDescription>
            Gestión de consultas médicas y diagnósticos de estudiantes
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Esperando</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{waitingCount}</div>
            <p className="text-xs text-muted-foreground">En sala de espera</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atendidos Hoy</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendedCount}</div>
            <p className="text-xs text-muted-foreground">Consultas completadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total del Día</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{arrivals.length}</div>
            <p className="text-xs text-muted-foreground">Llegadas registradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registros</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayCheckIns.length}</div>
            <p className="text-xs text-muted-foreground">En sistema</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Registro de Llegadas - {new Date().toLocaleDateString('es-HN')}</CardTitle>
              <CardDescription>
                Estudiantes que han llegado para consulta médica
              </CardDescription>
            </div>
            <div className="w-72">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre, cuenta o número de llegada..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredArrivals.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay llegadas registradas</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">No. Llegada</TableHead>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>No. Cuenta</TableHead>
                  <TableHead>Carrera</TableHead>
                  <TableHead>Hora Llegada</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Diagnóstico</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArrivals.map((arrival) => (
                  <TableRow key={arrival.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono font-bold text-[#004aad]">
                      #{arrival.arrivalNumber}
                    </TableCell>
                    <TableCell className="font-medium">
                      {arrival.studentName}
                    </TableCell>
                    <TableCell className="font-mono">
                      {arrival.accountNumber}
                    </TableCell>
                    <TableCell>
                      {arrival.career}
                    </TableCell>
                    <TableCell>
                      {new Date(arrival.arrivalTime).toLocaleTimeString('es-HN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell>
                      {getPriorityBadge(arrival.priority)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(arrival.status)}
                    </TableCell>
                    <TableCell className="max-w-48">
                      {arrival.diagnosis ? (
                        <p className="text-sm text-gray-700 truncate" title={arrival.diagnosis}>
                          {arrival.diagnosis}
                        </p>
                      ) : (
                        <span className="text-gray-400 text-sm">Sin diagnóstico</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {arrival.diagnosis ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(arrival)}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Ver
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleAssignDiagnosis(arrival)}
                            className="bg-[#004aad] hover:bg-[#003687] text-white"
                          >
                            <Stethoscope className="w-3 h-3 mr-1" />
                            Diagnosticar
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

      {/* Diagnosis Modal */}
      <DiagnosisModal
        isOpen={showDiagnosisModal}
        onClose={() => setShowDiagnosisModal(false)}
        patient={selectedPatient}
        onSave={handleSaveDiagnosis}
      />
    </div>
  );
}