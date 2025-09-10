import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { useData } from '../../context/DataContext';
import { SupportSession } from '../../types';
import { 
  Heart, Search, Filter, Eye, Calendar, User, 
  MapPin, Clock, FileText, Users
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function SupportSessionsListPage() {
  const { supportSessions } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [counselorFilter, setCounselorFilter] = useState('all');
  const [selectedSession, setSelectedSession] = useState<SupportSession | null>(null);

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
      'rechazada': 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  const handleViewSession = (session: SupportSession) => {
    setSelectedSession(session);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCounselorFilter('all');
    toast.success('Filtros limpiados');
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

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Sesiones</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supportSessions.length}</div>
            <p className="text-xs text-muted-foreground">Registradas en el sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {supportSessions.filter(s => s.status === 'pendiente').length}
            </div>
            <p className="text-xs text-muted-foreground">Esperando asignación</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Asignadas</CardTitle>
            <User className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {supportSessions.filter(s => s.status === 'asignada').length}
            </div>
            <p className="text-xs text-muted-foreground">Con consejero asignado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {supportSessions.filter(s => s.status === 'completada').length}
            </div>
            <p className="text-xs text-muted-foreground">Finalizadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <TableHead>Estudiante</TableHead>
                  <TableHead>No. Cuenta</TableHead>
                  <TableHead>Motivo Principal</TableHead>
                  <TableHead>Nivel Emocional</TableHead>
                  <TableHead>Modalidad</TableHead>
                  <TableHead>Consejero Asignado</TableHead>
                  <TableHead>Fecha Solicitud</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSessions.map((session) => (
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
                      <Badge className={getEmotionalLevelColor(session.emotionalLevel)}>
                        {getEmotionalLevelText(session.emotionalLevel)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="capitalize">{session.modality}</span>
                      </div>
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
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewSession(session)}
                        className="text-[#004aad] border-[#004aad] hover:bg-[#004aad] hover:text-white"
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

      {/* View Session Details Modal */}
      <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
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
                  <div>
                    <span className="text-gray-600">Horario Preferido:</span>
                    <p className="font-medium">{selectedSession.preferredTime}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Sesiones Previas:</span>
                    <p className="font-medium">{selectedSession.previousSessions ? 'Sí' : 'No'}</p>
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

                {selectedSession.additionalComments && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Comentarios Adicionales</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {selectedSession.additionalComments}
                    </p>
                  </div>
                )}
              </div>

              {/* Assignment Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Información de Asignación</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Estado:</span>
                    <div className="mt-1">{getStatusBadge(selectedSession.status)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Consejero Asignado:</span>
                    <p className="font-medium">
                      {selectedSession.assignedCounselorName || 'Sin asignar'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Fecha de Solicitud:</span>
                    <p className="font-medium">{formatDate(selectedSession.createdAt)}</p>
                  </div>
                  {selectedSession.scheduledAt && (
                    <div>
                      <span className="text-gray-600">Fecha Programada:</span>
                      <p className="font-medium">{formatDate(selectedSession.scheduledAt)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t">
                <Button 
                  onClick={() => setSelectedSession(null)}
                  className="bg-[#004aad] hover:bg-[#003687] text-white"
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