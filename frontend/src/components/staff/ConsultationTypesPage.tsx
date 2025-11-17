import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ConsultationType } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Badge } from '../ui/badge';
import { Eye, Pencil, Trash2, Plus, Search, Filter, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner@2.0.3';

export function ConsultationTypesPage() {
  const { consultationTypes, addConsultationType, updateConsultationType, deleteConsultationType } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<ConsultationType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    estimatedDuration: 30,
    isActive: true,
  });

  const filteredTypes = consultationTypes.filter((type) => {
    const matchesSearch = type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && type.isActive) || 
      (statusFilter === 'inactive' && !type.isActive);
    return matchesSearch && matchesStatus;
  });

  const handleCreateType = () => {
    addConsultationType(formData);
    setIsCreateDialogOpen(false);
    setFormData({ name: '', description: '', estimatedDuration: 30, isActive: true });
    toast.success('Tipo de consulta creado exitosamente');
  };

  const handleEditType = () => {
    if (selectedType) {
      updateConsultationType(selectedType.id, formData);
      setIsEditDialogOpen(false);
      setSelectedType(null);
      setFormData({ name: '', description: '', estimatedDuration: 30, isActive: true });
      toast.success('Tipo de consulta actualizado exitosamente');
    }
  };

  const handleDeleteType = (type: ConsultationType) => {
    if (window.confirm(`¿Está seguro que desea eliminar el tipo de consulta "${type.name}"?`)) {
      deleteConsultationType(type.id);
      toast.success('Tipo de consulta eliminado exitosamente');
    }
  };

  const openCreateDialog = () => {
    setFormData({ name: '', description: '', estimatedDuration: 30, isActive: true });
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (type: ConsultationType) => {
    setSelectedType(type);
    setFormData({
      name: type.name,
      description: type.description,
      estimatedDuration: type.estimatedDuration,
      isActive: type.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (type: ConsultationType) => {
    setSelectedType(type);
    setIsViewDialogOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    toast.success('Filtros limpiados');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-[#004aad]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#004aad]">
            <FileText className="w-5 h-5" />
            Tipos de Consulta Académica
          </CardTitle>
          <CardDescription>
            Gestión de tipos de consultas académicas
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Button onClick={openCreateDialog} className="bg-[#004aad] hover:bg-[#003687] w-full">
                <Plus className="w-4 h-4 mr-2" />
                Crear Tipo
              </Button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nombre o descripción..."
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
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters} className="w-full">
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consultation Types Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Tipos de Consulta ({filteredTypes.length} de {consultationTypes.length})
          </CardTitle>
          <CardDescription>
            Lista completa de todos los tipos de consulta registrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTypes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron tipos de consulta con los filtros aplicados</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Duración Estimada</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTypes.map((type) => (
                  <TableRow key={type.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{type.name}</TableCell>
                    <TableCell className="max-w-md truncate">{type.description}</TableCell>
                    <TableCell>{type.estimatedDuration} minutos</TableCell>
                    <TableCell>
                      <Badge variant={type.isActive ? 'default' : 'secondary'} className={type.isActive ? 'bg-green-600' : ''}>
                        {type.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openViewDialog(type)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Ver Detalles
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(type)}
                          className="text-[#edba0d] hover:text-[#d4a50c] hover:bg-yellow-50"
                        >
                          <Pencil className="w-3 h-3 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteType(type)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Tipo de Consulta</DialogTitle>
            <DialogDescription>
              Ingrese los datos del tipo de consulta a crear
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Orientación Académica"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe el tipo de consulta"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duración Estimada (minutos)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({ ...formData, estimatedDuration: parseInt(e.target.value) || 30 })}
                min="15"
                step="15"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Tipo activo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateType} className="bg-[#004aad] hover:bg-[#003687]">
              Crear Tipo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Tipo de Consulta</DialogTitle>
            <DialogDescription>
              Modifique los datos del tipo de consulta
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nombre</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Descripción</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-duration">Duración Estimada (minutos)</Label>
              <Input
                id="edit-duration"
                type="number"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({ ...formData, estimatedDuration: parseInt(e.target.value) || 30 })}
                min="15"
                step="15"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="edit-isActive">Tipo activo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditType} className="bg-[#004aad] hover:bg-[#003687]">
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles del Tipo de Consulta</DialogTitle>
          </DialogHeader>
          {selectedType && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-gray-600">Nombre</Label>
                <p className="mt-1">{selectedType.name}</p>
              </div>
              <div>
                <Label className="text-gray-600">Descripción</Label>
                <p className="mt-1">{selectedType.description}</p>
              </div>
              <div>
                <Label className="text-gray-600">Duración Estimada</Label>
                <p className="mt-1">{selectedType.estimatedDuration} minutos</p>
              </div>
              <div>
                <Label className="text-gray-600">Estado</Label>
                <div className="mt-1">
                  <Badge variant={selectedType.isActive ? 'default' : 'secondary'} className={selectedType.isActive ? 'bg-green-600' : ''}>
                    {selectedType.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-gray-600">Fecha de Creación</Label>
                <p className="mt-1">
                  {new Date(selectedType.createdAt).toLocaleDateString('es-HN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}