import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useData } from '../../context/DataContext';
import { SupportSession } from '../../types';
import { 
  Heart, Search, Filter, Eye, Calendar, User, 
  MapPin, Clock, ChevronDown, ChevronRight, Plus, Pencil, Trash2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// Mock action plans data
const mockActionPlans = {
  'sup-1': [
    { id: 'ap-1', sessionId: 'sup-1', goal: 'Mejorar técnicas de gestión del estrés', actions: 'Practicar respiración profunda diariamente', timeline: '4 semanas', status: 'en-progreso', createdAt: '2024-11-01' },
    { id: 'ap-2', sessionId: 'sup-1', goal: 'Establecer rutina de sueño', actions: 'Dormir 8 horas diarias', timeline: '2 semanas', status: 'completado', createdAt: '2024-10-28' }
  ],
  'sup-2': [
    { id: 'ap-3', sessionId: 'sup-2', goal: 'Fortalecer autoestima', actions: 'Llevar diario de logros', timeline: '6 semanas', status: 'en-progreso', createdAt: '2024-10-30' }
  ]
};

export function SupportSessionsListPage() {
  const { supportSessions } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [counselorFilter, setCounselorFilter] = useState('all');
  const [selectedSession, setSelectedSession] = useState<SupportSession | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  
  // CRUD Dialogs
  const [isCreateSessionOpen, setIsCreateSessionOpen] = useState(false);
  const [isEditSessionOpen, setIsEditSessionOpen] = useState(false);
  const [isViewSessionOpen, setIsViewSessionOpen] = useState(false);
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);
  const [isEditPlanOpen, setIsEditPlanOpen] = useState(false);
  const [isViewPlanOpen, setIsViewPlanOpen] = useState(false);
  
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [currentSessionForPlan, setCurrentSessionForPlan] = useState<string>('');

  // Get unique counselors for filter
  const uniqueCounselors = Array.from(
    new Set(
      supportSessions
        .filter(session => session.assignedCounselorName)
        .map(session => session.assignedCounselorName)
    )
  );

  // Filter sessions based on search and filters
  const filteredSessions = supportSessions.filter(session => {
    const matchesSearch = 
      session.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.accountNumber.includes(searchTerm) ||
      session.mainReason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    const matchesCounselor = counselorFilter === 'all' || session.assignedCounselorName === counselorFilter;

    return matchesSearch && matchesStatus && matchesCounselor;
  });

  const toggleRow = (sessionId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(sessionId)) {
      newExpanded.delete(sessionId);
    } else {
      newExpanded.add(sessionId);
    }
    setExpandedRows(newExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-HN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getEmotionalLevelText = (level: number) => {
    const levels = {
      1: 'Muy Bajo',
      2: 'Bajo',
      3: 'Moderado',
      4: 'Alto',
      5: 'Muy Alto'
    };
    return levels[level as keyof typeof levels] || 'N/A';
  };

  const getEmotionalLevelColor = (level: number) => {
    if (level <= 2) return 'bg-green-100 text-green-800';
    if (level === 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pendiente': 'bg-yellow-100 text-yellow-800',
      'asignada': 'bg-blue-100 text-blue-800',
      'completada': 'bg-green-100 text-green-800',
      'rechazada': 'bg-red-100 text-red-800',
      'en-progreso': 'bg-blue-100 text-blue-800'
    };
    
    return (
      <Badge className={statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  const handleViewSession = (session: SupportSession) => {
    setSelectedSession(session);
    setIsViewSessionOpen(true);
  };

  const handleEditSession = (session: SupportSession) => {
    setSelectedSession(session);
    setIsEditSessionOpen(true);
  };

  const handleDeleteSession = (session: SupportSession) => {
    if (window.confirm(`¿Está seguro que desea eliminar la sesión de ${session.studentName}?`)) {
      toast.success('Sesión eliminada correctamente');
    }
  };

  const handleCreatePlan = (sessionId: string) => {
    setCurrentSessionForPlan(sessionId);
    setIsCreatePlanOpen(true);
  };

  const handleViewPlan = (plan: any) => {
    setSelectedPlan(plan);
    setIsViewPlanOpen(true);
  };

  const handleEditPlan = (plan: any) => {
    setSelectedPlan(plan);
    setIsEditPlanOpen(true);
  };

  const handleDeletePlan = (plan: any) => {
    if (window.confirm(`¿Está seguro que desea eliminar este plan de acción?`)) {
      toast.success('Plan de acción eliminado correctamente');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCounselorFilter('all');
    toast.success('Filtros limpiados');
  };

  const getActionPlans = (sessionId: string) => {
    return mockActionPlans[sessionId as keyof typeof mockActionPlans] || [];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-[#004aad]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#004aad]">
            <Heart className="w-5 h-5" />
            Listado de Sesiones de Apoyo Psicológico
          </CardTitle>
          <CardDescription>
            Vista completa de todas las sesiones de apoyo registradas en el sistema
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Button 
                onClick={() => setIsCreateSessionOpen(true)} 
                className="bg-[#004aad] hover:bg-[#003687] w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Sesión
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nombre, cuenta o motivo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="asignada">Asignada</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                  <SelectItem value="rechazada">Rechazada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Consejero</label>
              <Select value={counselorFilter} onValueChange={setCounselorFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los consejeros" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los consejeros</SelectItem>
                  {uniqueCounselors.map((counselor) => (
                    <SelectItem key={counselor} value={counselor}>
                      {counselor}
                    </SelectItem>
                  ))}
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

      {/* Sessions Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Sesiones de Apoyo ({filteredSessions.length} de {supportSessions.length})
          </CardTitle>
          <CardDescription>
            Lista completa de todas las sesiones de apoyo psicológico registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSessions.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron sesiones con los filtros aplicados</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>No. Cuenta</TableHead>
                  <TableHead>Motivo Principal</TableHead>
                  <TableHead>Nivel Emocional</TableHead>
                  <TableHead>Consejero Asignado</TableHead>
                  <TableHead>Fecha Solicitud</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSessions.map((session) => {
                  const isExpanded = expandedRows.has(session.id);
                  const actionPlans = getActionPlans(session.id);
                  
                  return (
                    <React.Fragment key={session.id}>
                      <TableRow className="hover:bg-gray-50">
                        <TableCell>
                          {actionPlans.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleRow(session.id)}
                              className="p-0 h-6 w-6"
                            >
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </TableCell>
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
                          <Badge className={getEmotionalLevelColor(session.emotionalLevel)}>
                            {getEmotionalLevelText(session.emotionalLevel)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {session.assignedCounselorName ? (
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3 text-blue-600" />
                              <span className="text-blue-600 font-medium">
                                {session.assignedCounselorName}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400">Sin asignar</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(session.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(session.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewSession(session)}
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Ver Detalles
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditSession(session)}
                              className="text-[#edba0d] border-[#edba0d] hover:bg-yellow-50"
                            >
                              <Pencil className="w-3 h-3 mr-1" />
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteSession(session)}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Eliminar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      
                      {/* Expanded Row - Action Plans */}
                      {isExpanded && actionPlans.length > 0 && (
                        <TableRow>
                          <TableCell colSpan={9} className="bg-gray-50 p-0">
                            <div className="p-4">
                              <div className="flex justify-between items-center mb-3">
                                <h4 className="font-medium text-sm">Planes de Acción</h4>
                                <Button
                                  size="sm"
                                  onClick={() => handleCreatePlan(session.id)}
                                  className="bg-[#004aad] hover:bg-[#003687]"
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  Crear Plan
                                </Button>
                              </div>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Objetivo</TableHead>
                                    <TableHead>Acciones</TableHead>
                                    <TableHead>Cronograma</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Fecha Creación</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {actionPlans.map((plan) => (
                                    <TableRow key={plan.id} className="hover:bg-white">
                                      <TableCell className="font-medium">{plan.goal}</TableCell>
                                      <TableCell className="max-w-48 truncate">{plan.actions}</TableCell>
                                      <TableCell>{plan.timeline}</TableCell>
                                      <TableCell>{getStatusBadge(plan.status)}</TableCell>
                                      <TableCell>{formatDate(plan.createdAt)}</TableCell>
                                      <TableCell className="text-right">
                                        <div className="flex gap-1 justify-end">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleViewPlan(plan)}
                                            className="text-blue-600 hover:bg-blue-50"
                                          >
                                            <Eye className="w-3 h-3 mr-1" />
                                            Ver Detalles
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleEditPlan(plan)}
                                            className="text-[#edba0d] hover:bg-yellow-50"
                                          >
                                            <Pencil className="w-3 h-3 mr-1" />
                                            Editar
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleDeletePlan(plan)}
                                            className="text-red-600 hover:bg-red-50"
                                          >
                                            <Trash2 className="w-3 h-3 mr-1" />
                                            Eliminar
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Session Dialog */}
      <Dialog open={isCreateSessionOpen} onOpenChange={setIsCreateSessionOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Nueva Sesión de Apoyo</DialogTitle>
            <DialogDescription>
              Ingrese los datos de la sesión a crear
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-500">Formulario de creación de sesión...</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateSessionOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                toast.success('Sesión creada exitosamente');
                setIsCreateSessionOpen(false);
              }}
              className="bg-[#004aad] hover:bg-[#003687]"
            >
              Crear Sesión
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Session Dialog */}
      <Dialog open={isEditSessionOpen} onOpenChange={setIsEditSessionOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Sesión de Apoyo</DialogTitle>
            <DialogDescription>
              Modifique los datos de la sesión
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-500">Formulario de edición de sesión...</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditSessionOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                toast.success('Sesión actualizada exitosamente');
                setIsEditSessionOpen(false);
              }}
              className="bg-[#004aad] hover:bg-[#003687]"
            >
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Session Details Modal */}
      <Dialog open={isViewSessionOpen} onOpenChange={() => setIsViewSessionOpen(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#004aad]" />
              Detalles de la Sesión de Apoyo
            </DialogTitle>
            <DialogDescription>
              Información completa de la sesión seleccionada
            </DialogDescription>
          </DialogHeader>

          {selectedSession && (
            <div className="space-y-6">
              {/* Student Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-[#004aad] mb-3">Información del Estudiante</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Nombre:</span>
                    <p className="font-medium">{selectedSession.studentName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">No. Cuenta:</span>
                    <p className="font-medium">{selectedSession.accountNumber}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Nivel de Malestar Emocional:</span>
                    <Badge className={getEmotionalLevelColor(selectedSession.emotionalLevel)}>
                      {getEmotionalLevelText(selectedSession.emotionalLevel)} ({selectedSession.emotionalLevel}/5)
                    </Badge>
                  </div>
                  <div>
                    <span className="text-gray-600">Modalidad Preferida:</span>
                    <p className="font-medium capitalize">{selectedSession.modality}</p>
                  </div>
                </div>
              </div>

              {/* Session Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Motivo Principal</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {selectedSession.mainReason}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t">
                <Button 
                  onClick={() => setIsViewSessionOpen(false)}
                  className="bg-[#004aad] hover:bg-[#003687] text-white"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Action Plan Dialog */}
      <Dialog open={isCreatePlanOpen} onOpenChange={setIsCreatePlanOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Plan de Acción</DialogTitle>
            <DialogDescription>
              Ingrese los datos del plan de acción
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Objetivo</Label>
              <Input placeholder="Ej: Mejorar técnicas de gestión del estrés" />
            </div>
            <div className="space-y-2">
              <Label>Acciones</Label>
              <Textarea placeholder="Describa las acciones a realizar..." />
            </div>
            <div className="space-y-2">
              <Label>Cronograma</Label>
              <Input placeholder="Ej: 4 semanas" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatePlanOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                toast.success('Plan de acción creado exitosamente');
                setIsCreatePlanOpen(false);
              }}
              className="bg-[#004aad] hover:bg-[#003687]"
            >
              Crear Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Action Plan Dialog */}
      <Dialog open={isEditPlanOpen} onOpenChange={setIsEditPlanOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Plan de Acción</DialogTitle>
            <DialogDescription>
              Modifique los datos del plan de acción
            </DialogDescription>
          </DialogHeader>
          {selectedPlan && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Objetivo</Label>
                <Input defaultValue={selectedPlan.goal} />
              </div>
              <div className="space-y-2">
                <Label>Acciones</Label>
                <Textarea defaultValue={selectedPlan.actions} />
              </div>
              <div className="space-y-2">
                <Label>Cronograma</Label>
                <Input defaultValue={selectedPlan.timeline} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditPlanOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                toast.success('Plan de acción actualizado exitosamente');
                setIsEditPlanOpen(false);
              }}
              className="bg-[#004aad] hover:bg-[#003687]"
            >
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Action Plan Dialog */}
      <Dialog open={isViewPlanOpen} onOpenChange={() => setIsViewPlanOpen(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del Plan de Acción</DialogTitle>
            <DialogDescription>
              Información completa del plan seleccionado
            </DialogDescription>
          </DialogHeader>
          {selectedPlan && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-gray-600">Objetivo</Label>
                <p className="mt-1">{selectedPlan.goal}</p>
              </div>
              <div>
                <Label className="text-gray-600">Acciones</Label>
                <p className="mt-1">{selectedPlan.actions}</p>
              </div>
              <div>
                <Label className="text-gray-600">Cronograma</Label>
                <p className="mt-1">{selectedPlan.timeline}</p>
              </div>
              <div>
                <Label className="text-gray-600">Estado</Label>
                <div className="mt-1">{getStatusBadge(selectedPlan.status)}</div>
              </div>
              <div>
                <Label className="text-gray-600">Fecha de Creación</Label>
                <p className="mt-1">{formatDate(selectedPlan.createdAt)}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewPlanOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
