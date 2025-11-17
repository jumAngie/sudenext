import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Personnel } from '../../types';
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
import { Eye, Pencil, Trash2, Plus, Search, Filter, Users } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner@2.0.3';

export function PersonnelPage() {
  const { personnel, addPersonnel, updatePersonnel, deletePersonnel, areas } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Personnel | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    areaId: '',
    position: '',
    isActive: true,
  });

  const filteredPersonnel = personnel.filter((person) => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.areaName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = areaFilter === 'all' || person.areaId === areaFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && person.isActive) || 
      (statusFilter === 'inactive' && !person.isActive);
    return matchesSearch && matchesArea && matchesStatus;
  });

  const handleCreatePerson = () => {
    const selectedArea = areas.find(a => a.id === formData.areaId);
    if (!selectedArea) {
      toast.error('Debe seleccionar un área');
      return;
    }
    
    addPersonnel({
      ...formData,
      areaName: selectedArea.name,
    });
    setIsCreateDialogOpen(false);
    setFormData({ name: '', email: '', phone: '', areaId: '', position: '', isActive: true });
    toast.success('Personal creado exitosamente');
  };

  const handleEditPerson = () => {
    if (selectedPerson) {
      const selectedArea = areas.find(a => a.id === formData.areaId);
      if (!selectedArea) {
        toast.error('Debe seleccionar un área');
        return;
      }
      
      updatePersonnel(selectedPerson.id, {
        ...formData,
        areaName: selectedArea.name,
      });
      setIsEditDialogOpen(false);
      setSelectedPerson(null);
      setFormData({ name: '', email: '', phone: '', areaId: '', position: '', isActive: true });
      toast.success('Personal actualizado exitosamente');
    }
  };

  const handleDeletePerson = (person: Personnel) => {
    if (window.confirm(`¿Está seguro que desea eliminar a "${person.name}"?`)) {
      deletePersonnel(person.id);
      toast.success('Personal eliminado exitosamente');
    }
  };

  const openCreateDialog = () => {
    setFormData({ name: '', email: '', phone: '', areaId: '', position: '', isActive: true });
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (person: Personnel) => {
    setSelectedPerson(person);
    setFormData({
      name: person.name,
      email: person.email,
      phone: person.phone,
      areaId: person.areaId,
      position: person.position,
      isActive: person.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (person: Personnel) => {
    setSelectedPerson(person);
    setIsViewDialogOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setAreaFilter('all');
    setStatusFilter('all');
    toast.success('Filtros limpiados');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-[#004aad]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#004aad]">
            <Users className="w-5 h-5" />
            Gestión de Personal
          </CardTitle>
          <CardDescription>
            Administración del personal del SUDECAD
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
              <Button onClick={openCreateDialog} className="bg-[#004aad] hover:bg-[#003687] w-full">
                <Plus className="w-4 h-4 mr-2" />
                Crear Personal
              </Button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nombre, email, posición..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Área</label>
              <Select value={areaFilter} onValueChange={setAreaFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las áreas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las áreas</SelectItem>
                  {areas.map((area) => (
                    <SelectItem key={area.id} value={area.id}>
                      {area.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

      {/* Personnel Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Personal ({filteredPersonnel.length} de {personnel.length})
          </CardTitle>
          <CardDescription>
            Lista completa de todo el personal registrado
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPersonnel.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontró personal con los filtros aplicados</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead>Posición</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPersonnel.map((person) => (
                  <TableRow key={person.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{person.name}</TableCell>
                    <TableCell>{person.email}</TableCell>
                    <TableCell>{person.phone}</TableCell>
                    <TableCell>{person.areaName}</TableCell>
                    <TableCell>{person.position}</TableCell>
                    <TableCell>
                      <Badge variant={person.isActive ? 'default' : 'secondary'} className={person.isActive ? 'bg-green-600' : ''}>
                        {person.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openViewDialog(person)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Ver Detalles
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(person)}
                          className="text-[#edba0d] hover:text-[#d4a50c] hover:bg-yellow-50"
                        >
                          <Pencil className="w-3 h-3 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePerson(person)}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Personal</DialogTitle>
            <DialogDescription>
              Ingrese los datos del personal a crear
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Dr. Juan Pérez"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="juan.perez@unah.edu.hn"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="9876-5432"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">Área</Label>
              <Select value={formData.areaId} onValueChange={(value) => setFormData({ ...formData, areaId: value })}>
                <SelectTrigger id="area">
                  <SelectValue placeholder="Seleccione un área" />
                </SelectTrigger>
                <SelectContent>
                  {areas.filter(a => a.isActive).map((area) => (
                    <SelectItem key={area.id} value={area.id}>
                      {area.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Posición</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="Ej: Médico General"
              />
            </div>
            <div className="flex items-center space-x-2 pt-7">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Personal activo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreatePerson} className="bg-[#004aad] hover:bg-[#003687]">
              Crear Personal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Personal</DialogTitle>
            <DialogDescription>
              Modifique los datos del personal
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nombre Completo</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Teléfono</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-area">Área</Label>
              <Select value={formData.areaId} onValueChange={(value) => setFormData({ ...formData, areaId: value })}>
                <SelectTrigger id="edit-area">
                  <SelectValue placeholder="Seleccione un área" />
                </SelectTrigger>
                <SelectContent>
                  {areas.filter(a => a.isActive).map((area) => (
                    <SelectItem key={area.id} value={area.id}>
                      {area.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-position">Posición</Label>
              <Input
                id="edit-position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2 pt-7">
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="edit-isActive">Personal activo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditPerson} className="bg-[#004aad] hover:bg-[#003687]">
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles del Personal</DialogTitle>
          </DialogHeader>
          {selectedPerson && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-gray-600">Nombre Completo</Label>
                <p className="mt-1">{selectedPerson.name}</p>
              </div>
              <div>
                <Label className="text-gray-600">Email</Label>
                <p className="mt-1">{selectedPerson.email}</p>
              </div>
              <div>
                <Label className="text-gray-600">Teléfono</Label>
                <p className="mt-1">{selectedPerson.phone}</p>
              </div>
              <div>
                <Label className="text-gray-600">Área</Label>
                <p className="mt-1">{selectedPerson.areaName}</p>
              </div>
              <div>
                <Label className="text-gray-600">Posición</Label>
                <p className="mt-1">{selectedPerson.position}</p>
              </div>
              <div>
                <Label className="text-gray-600">Estado</Label>
                <div className="mt-1">
                  <Badge variant={selectedPerson.isActive ? 'default' : 'secondary'} className={selectedPerson.isActive ? 'bg-green-600' : ''}>
                    {selectedPerson.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-gray-600">Fecha de Creación</Label>
                <p className="mt-1">
                  {new Date(selectedPerson.createdAt).toLocaleDateString('es-HN', {
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
