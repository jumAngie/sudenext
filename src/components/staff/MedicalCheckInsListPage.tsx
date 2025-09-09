import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { useData } from '../../context/DataContext';
import { MedicalCheckIn } from '../../types';
import { 
  Heart, Search, Filter, Eye, Calendar, User, 
  Thermometer, Activity, AlertCircle, Users, CheckCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function MedicalCheckInsListPage() {
  const { medicalCheckIns } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [attendedFilter, setAttendedFilter] = useState('all');
  const [symptomsFilter, setSymptomsFilter] = useState('all');
  const [selectedCheckIn, setSelectedCheckIn] = useState<MedicalCheckIn | null>(null);

  // Filter check-ins based on search and filters
  const filteredCheckIns = medicalCheckIns.filter(checkIn => {
    const matchesSearch = 
      checkIn.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checkIn.accountNumber.includes(searchTerm) ||
      (checkIn.observations && checkIn.observations.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesAttended = attendedFilter === 'all' || 
      (attendedFilter === 'attended' && checkIn.attended) ||
      (attendedFilter === 'pending' && !checkIn.attended);
    
    const matchesSymptoms = symptomsFilter === 'all' ||
      (symptomsFilter === 'with-symptoms' && checkIn.symptoms && checkIn.symptoms.length > 0) ||
      (symptomsFilter === 'no-symptoms' && (!checkIn.symptoms || checkIn.symptoms.length === 0));

    return matchesSearch && matchesAttended && matchesSymptoms;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-HN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTemperatureColor = (temperature: number | undefined) => {
    if (!temperature) return 'text-gray-500';
    if (temperature >= 38) return 'text-red-600';
    if (temperature >= 37.5) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getTemperatureStatus = (temperature: number | undefined) => {
    if (!temperature) return 'No registrada';
    if (temperature >= 38) return 'Fiebre';
    if (temperature >= 37.5) return 'Febrícula';
    return 'Normal';
  };

  const handleViewCheckIn = (checkIn: MedicalCheckIn) => {
    setSelectedCheckIn(checkIn);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setAttendedFilter('all');
    setSymptomsFilter('all');
    toast.success('Filtros limpiados');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#004aad]">
            <Heart className="w-5 h-5" />
            Listado de Check-ins Médicos
          </CardTitle>
          <CardDescription>
            Vista completa de todos los check-ins médicos registrados en el sistema
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Check-ins</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{medicalCheckIns.length}</div>
            <p className="text-xs text-muted-foreground">Registrados en el sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atendidos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {medicalCheckIns.filter(c => c.attended).length}
            </div>
            <p className="text-xs text-muted-foreground">Check-ins completados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {medicalCheckIns.filter(c => !c.attended).length}
            </div>
            <p className="text-xs text-muted-foreground">Esperando atención</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Con Síntomas</CardTitle>
            <Thermometer className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {medicalCheckIns.filter(c => c.symptoms && c.symptoms.length > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">Reportan síntomas</p>
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
                  placeholder="Nombre, cuenta u observaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Estado de Atención</label>
              <Select value={attendedFilter} onValueChange={setAttendedFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="attended">Atendidos</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Síntomas</label>
              <Select value={symptomsFilter} onValueChange={setSymptomsFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="with-symptoms">Con síntomas</SelectItem>
                  <SelectItem value="no-symptoms">Sin síntomas</SelectItem>
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

      {/* Check-ins Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Check-ins Médicos ({filteredCheckIns.length} de {medicalCheckIns.length})
          </CardTitle>
          <CardDescription>
            Lista completa de todos los check-ins médicos registrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCheckIns.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron check-ins con los filtros aplicados</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>No. Cuenta</TableHead>
                  <TableHead>Síntomas</TableHead>
                  <TableHead>Temperatura</TableHead>
                  <TableHead>Presión Arterial</TableHead>
                  <TableHead>Observaciones</TableHead>
                  <TableHead>Fecha/Hora</TableHead>
                  <TableHead>Atendido</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCheckIns.map((checkIn) => (
                  <TableRow key={checkIn.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {checkIn.studentName}
                    </TableCell>
                    <TableCell className="font-mono">
                      {checkIn.accountNumber}
                    </TableCell>
                    <TableCell className="max-w-48">
                      {checkIn.symptoms && checkIn.symptoms.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {checkIn.symptoms.slice(0, 2).map((symptom, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {symptom}
                            </Badge>
                          ))}
                          {checkIn.symptoms.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{checkIn.symptoms.length - 2}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">Sin síntomas</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Thermometer className={`w-3 h-3 ${getTemperatureColor(checkIn.temperature)}`} />
                        <span className={getTemperatureColor(checkIn.temperature)}>
                          {checkIn.temperature ? `${checkIn.temperature}°C` : 'N/R'}
                        </span>
                      </div>
                      <p className={`text-xs ${getTemperatureColor(checkIn.temperature)}`}>
                        {getTemperatureStatus(checkIn.temperature)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Activity className="w-3 h-3 text-blue-600" />
                        <span>{checkIn.bloodPressure || 'N/R'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-32">
                      {checkIn.observations ? (
                        <p className="truncate text-sm" title={checkIn.observations}>
                          {checkIn.observations}
                        </p>
                      ) : (
                        <span className="text-gray-400">Sin observaciones</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span className="text-sm">{formatDate(checkIn.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {checkIn.attended ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Sí
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          No
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewCheckIn(checkIn)}
                        className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
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

      {/* View Check-in Details Modal */}
      <Dialog open={!!selectedCheckIn} onOpenChange={() => setSelectedCheckIn(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-green-600" />
              Detalles del Check-in Médico
            </DialogTitle>
            <DialogDescription>
              Información completa del check-in seleccionado
            </DialogDescription>
          </DialogHeader>

          {selectedCheckIn && (
            <div className="space-y-6">
              {/* Student Information */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-[#004aad] mb-3">Información del Estudiante</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Nombre:</span>
                    <p className="font-medium">{selectedCheckIn.studentName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">No. Cuenta:</span>
                    <p className="font-medium">{selectedCheckIn.accountNumber}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Fecha y Hora:</span>
                    <p className="font-medium">{formatDate(selectedCheckIn.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Estado:</span>
                    {selectedCheckIn.attended ? (
                      <Badge className="bg-green-100 text-green-800 mt-1">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Atendido
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800 mt-1">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Pendiente
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Thermometer className={`w-4 h-4 ${getTemperatureColor(selectedCheckIn.temperature)}`} />
                      Temperatura Corporal
                    </h4>
                    <p className={`text-lg font-semibold ${getTemperatureColor(selectedCheckIn.temperature)}`}>
                      {selectedCheckIn.temperature ? `${selectedCheckIn.temperature}°C` : 'No registrada'}
                    </p>
                    <p className={`text-sm ${getTemperatureColor(selectedCheckIn.temperature)}`}>
                      {getTemperatureStatus(selectedCheckIn.temperature)}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-600" />
                      Presión Arterial
                    </h4>
                    <p className="text-lg font-semibold text-blue-600">
                      {selectedCheckIn.bloodPressure || 'No registrada'}
                    </p>
                    <p className="text-sm text-gray-600">mmHg</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Síntomas Reportados</h4>
                  {selectedCheckIn.symptoms && selectedCheckIn.symptoms.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedCheckIn.symptoms.map((symptom, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 bg-gray-50 p-3 rounded-lg">Sin síntomas reportados</p>
                  )}
                </div>

                {selectedCheckIn.observations && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Observaciones Adicionales</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {selectedCheckIn.observations}
                    </p>
                  </div>
                )}
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t">
                <Button 
                  onClick={() => setSelectedCheckIn(null)}
                  className="bg-green-600 hover:bg-green-700 text-white"
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