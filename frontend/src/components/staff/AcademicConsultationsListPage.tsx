import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { useData } from '../../context/DataContext';
import { AcademicConsultation } from '../../types';
import { 
  BookOpen, Search, Filter, Eye, Calendar, User, 
  AlertTriangle, Users, CheckCircle, FileText
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function AcademicConsultationsListPage() {
  const { academicConsultations } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [advisorFilter, setAdvisorFilter] = useState('all');
  const [followUpFilter, setFollowUpFilter] = useState('all');
  const [selectedConsultation, setSelectedConsultation] = useState<AcademicConsultation | null>(null);

  // Get unique advisors and consultation types for filters
  const uniqueAdvisors = Array.from(
    new Set(
      academicConsultations
        .filter(consultation => consultation.advisorName)
        .map(consultation => consultation.advisorName)
    )
  );

  const uniqueTypes = Array.from(
    new Set(academicConsultations.map(consultation => consultation.consultationType))
  );

  // Filter consultations based on search and filters
  const filteredConsultations = academicConsultations.filter(consultation => {
    const matchesSearch = 
      consultation.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.accountNumber.includes(searchTerm) ||
      consultation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.consultationType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || consultation.status === statusFilter;
    const matchesType = typeFilter === 'all' || consultation.consultationType === typeFilter;
    const matchesAdvisor = advisorFilter === 'all' || consultation.advisorName === advisorFilter;
    const matchesFollowUp = followUpFilter === 'all' ||
      (followUpFilter === 'required' && consultation.followUpRequired) ||
      (followUpFilter === 'not-required' && !consultation.followUpRequired);

    return matchesSearch && matchesStatus && matchesType && matchesAdvisor && matchesFollowUp;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-HN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pendiente': 'bg-yellow-100 text-yellow-800',
      'completada': 'bg-green-100 text-green-800'
    };
    
    return (
      <Badge className={statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  const getConsultationTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'orientación académica': return 'bg-blue-100 text-blue-800';
      case 'cambio de carrera': return 'bg-purple-100 text-purple-800';
      case 'planificación de estudios': return 'bg-green-100 text-green-800';
      case 'dificultades académicas': return 'bg-red-100 text-red-800';
      case 'becas y financiamiento': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewConsultation = (consultation: AcademicConsultation) => {
    setSelectedConsultation(consultation);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    setAdvisorFilter('all');
    setFollowUpFilter('all');
    toast.success('Filtros limpiados');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#004aad]">
            <BookOpen className="w-5 h-5" />
            Listado de Consultas Académicas
          </CardTitle>
          <CardDescription>
            Vista completa de todas las consultas académicas registradas en el sistema
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
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nombre, cuenta o descripción..."
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
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Consulta</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {uniqueTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Asesor</label>
              <Select value={advisorFilter} onValueChange={setAdvisorFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los asesores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los asesores</SelectItem>
                  {uniqueAdvisors.map((advisor) => (
                    <SelectItem key={advisor} value={advisor}>
                      {advisor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Seguimiento</label>
              <Select value={followUpFilter} onValueChange={setFollowUpFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="required">Requiere seguimiento</SelectItem>
                  <SelectItem value="not-required">No requiere</SelectItem>
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

      {/* Consultations Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Consultas Académicas ({filteredConsultations.length} de {academicConsultations.length})
          </CardTitle>
          <CardDescription>
            Lista completa de todas las consultas académicas registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredConsultations.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron consultas con los filtros aplicados</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>No. Cuenta</TableHead>
                  <TableHead>Tipo de Consulta</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Asesor</TableHead>
                  <TableHead>Seguimiento</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConsultations.map((consultation) => (
                  <TableRow key={consultation.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {consultation.studentName}
                    </TableCell>
                    <TableCell className="font-mono">
                      {consultation.accountNumber}
                    </TableCell>
                    <TableCell>
                      <Badge className={getConsultationTypeColor(consultation.consultationType)}>
                        {consultation.consultationType}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-64">
                      <p className="truncate" title={consultation.description}>
                        {consultation.description}
                      </p>
                    </TableCell>
                    <TableCell>
                      {consultation.advisorName ? (
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-purple-600" />
                          <span className="text-purple-600 font-medium">
                            {consultation.advisorName}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Sin asignar</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {consultation.followUpRequired ? (
                        <Badge className="bg-orange-100 text-orange-800">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Requerido
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          No requerido
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(consultation.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(consultation.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewConsultation(consultation)}
                        className="text-purple-600 border-purple-600 hover:bg-purple-600 hover:text-white"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Ver Detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Consultation Details Modal */}
      <Dialog open={!!selectedConsultation} onOpenChange={() => setSelectedConsultation(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-600" />
              Detalles de la Consulta Académica
            </DialogTitle>
            <DialogDescription>
              Información completa de la consulta seleccionada
            </DialogDescription>
          </DialogHeader>

          {selectedConsultation && (
            <div className="space-y-6">
              {/* Student Information */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-[#004aad] mb-3">Información del Estudiante</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Nombre:</span>
                    <p className="font-medium">{selectedConsultation.studentName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">No. Cuenta:</span>
                    <p className="font-medium">{selectedConsultation.accountNumber}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Tipo de Consulta:</span>
                    <Badge className={getConsultationTypeColor(selectedConsultation.consultationType)}>
                      {selectedConsultation.consultationType}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-gray-600">Fecha de Consulta:</span>
                    <p className="font-medium">{formatDate(selectedConsultation.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Consultation Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Descripción de la Consulta</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {selectedConsultation.description}
                  </p>
                </div>

                {selectedConsultation.resolution && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Resolución</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {selectedConsultation.resolution}
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
                    <div className="mt-1">{getStatusBadge(selectedConsultation.status)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Asesor Asignado:</span>
                    <p className="font-medium">
                      {selectedConsultation.advisorName || 'Sin asignar'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Requiere Seguimiento:</span>
                    {selectedConsultation.followUpRequired ? (
                      <Badge className="bg-orange-100 text-orange-800 mt-1">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Sí, requiere seguimiento
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800 mt-1">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        No requiere seguimiento
                      </Badge>
                    )}
                  </div>
                  {selectedConsultation.followUpDate && (
                    <div>
                      <span className="text-gray-600">Fecha de Seguimiento:</span>
                      <p className="font-medium">{formatDate(selectedConsultation.followUpDate)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t">
                <Button 
                  onClick={() => setSelectedConsultation(null)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
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