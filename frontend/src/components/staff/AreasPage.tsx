import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Area } from '../../types';
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
import { Eye, Pencil, Trash2, Plus, Search, Filter, Layers } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "../ui/alert-dialog"
import { toast } from 'sonner@2.0.3';

export function AreasPage() {
  const { areas, addArea, updateArea, deleteArea } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState<Area | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [formData, setFormData] = useState({
    are_Nombre: '',
  });


  const filteredAreas = areas.filter((area) => {
    const matchesSearch = area.are_Nombre.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && area.are_Estado) ||
      (statusFilter === 'inactive' && !area.are_Estado);
    return matchesSearch && matchesStatus;
  });

  const totalRecords = filteredAreas.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  const currentRecords = filteredAreas.slice(indexOfFirstRecord, indexOfLastRecord);

  const handleCreateArea = async () => {
    await addArea({
      are_Nombre: formData.are_Nombre,
      usu_UsuarioCreacion: 1,
      are_FechaCreacion: new Date().toISOString().slice(0, 19),

    });
    setIsCreateDialogOpen(false);
    setFormData({ are_Nombre: '' });
    toast.success('Área creada exitosamente');
  };


  const handleEditArea = async () => {
    if (selectedArea) {
      await updateArea(selectedArea.are_ID, {
        are_Nombre: formData.are_Nombre,
        usu_UsuarioModificacion: 1,
        are_FechaModificacion: new Date().toISOString().slice(0, 19),
      });

      setIsEditDialogOpen(false);
      setSelectedArea(null);
      setFormData({ are_Nombre: '' });
      toast.success('Área actualizada exitosamente');
    }
  };


  const handleDeleteArea = async (area: Area) => {
    try {
      await deleteArea(area.are_ID, {
        are_ID: area.are_ID,
        are_Nombre: area.are_Nombre,
        usu_UsuarioCreacion: area.usu_UsuarioCreacion ?? 0,
        are_FechaCreacion: area.are_FechaCreacion ?? new Date().toISOString().slice(0, 19),
        usu_UsuarioModificacion: area.usu_UsuarioModificacion ?? 0,
        are_FechaModificacion: area.are_FechaModificacion ?? new Date().toISOString().slice(0, 19),
        usu_UsuarioEliminacion: 1,
        are_FechaEliminacion: new Date().toISOString().slice(0, 19),
        are_Estado: false,
      });

      toast.success("Área eliminada exitosamente");
    } catch (error) {
      console.error("Error al eliminar área:", error);
      toast.error("No se pudo eliminar el área");
    }
  };

  const openCreateDialog = () => {
    setFormData({ are_Nombre: '' });
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (area: Area) => {
    setSelectedArea(area);
    setFormData({
      are_Nombre: area.are_Nombre,
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (area: Area) => {
    setSelectedArea(area);
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
            <Layers className="w-5 h-5" />
            Gestión de Áreas
          </CardTitle>
          <CardDescription>
            Administración de las áreas del SUDECAD
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
                Crear Área
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

      {/* Areas Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Áreas ({filteredAreas.length} de {areas.length})
          </CardTitle>
          <CardDescription>
            Lista completa de todas las áreas registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAreas.length === 0 ? (
            <div className="text-center py-8">
              <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron áreas con los filtros aplicados</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Usuario Creador</TableHead>
                  <TableHead>Fecha de Creación</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRecords.map((area) => (
                  <TableRow key={area.are_ID} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {area.are_ID}
                    </TableCell>

                    <TableCell className="font-medium">
                      {area.are_Nombre}
                    </TableCell>

                    <TableCell>
                      {area.nombreCompleto_C ?? "—"}
                    </TableCell>

                    <TableCell>
                      {area.are_FechaCreacion
                        ? new Date(area.are_FechaCreacion).toLocaleDateString("es-HN")
                        : "—"}
                    </TableCell>

                    <TableCell>
                      <Badge variant={area.are_Estado ? "default" : "secondary"} className={area.are_Estado ? "bg-green-600" : ""}>
                        {area.are_Estado ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openViewDialog(area)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Ver Detalles
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(area)}
                          className="text-[#edba0d] hover:text-[#d4a50c] hover:bg-yellow-50"
                        >
                          <Pencil className="w-3 h-3 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setAreaToDelete(area);
                            setIsDeleteDialogOpen(true);
                          }}
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
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">

              {/* Info */}
              <p className="text-sm text-gray-600">
                Mostrando{" "}
                <span className="font-semibold">
                  {indexOfFirstRecord + 1} – {Math.min(indexOfLastRecord, totalRecords)}
                </span>{" "}
                de <span className="font-semibold">{totalRecords}</span> registros
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Anterior
                </Button>

                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nueva Área</DialogTitle>
            <DialogDescription>
              Ingrese los datos del área a crear
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.are_Nombre}
                onChange={(e) => setFormData({ ...formData, are_Nombre: e.target.value })}
                placeholder="Ej: Odontología"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateArea} className="bg-[#004aad] hover:bg-[#003687]">
              Crear Área
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Área</DialogTitle>
            <DialogDescription>
              Modifique los datos del área
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nombre</Label>
              <Input
                id="edit-name"
                value={formData.are_Nombre}
                onChange={(e) => setFormData({ ...formData, are_Nombre: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditArea} className="bg-[#004aad] hover:bg-[#003687]">
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-7xl">
          <DialogHeader>
            <DialogTitle>Detalles del Área</DialogTitle>
          </DialogHeader>
          {selectedArea && (
            <div className="space-y-8 py-4">
              {/* GRID DE 2 COLUMNAS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">

                <div>
                  <Label className="text-gray-600">Nombre</Label>
                  <p className="mt-1">{selectedArea.are_Nombre}</p>
                </div>

                <div>
                  <Label className="text-gray-600">Estado</Label>
                  <div className="mt-1">
                    <Badge
                      variant={selectedArea.are_Estado ? "default" : "secondary"}
                      className={selectedArea.are_Estado ? "bg-green-600" : ""}
                    >
                      {selectedArea.are_Estado ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                </div>

              </div>

              {/* Auditoría */}
              <h3 className="text-lg font-semibold mt-4">Auditoría</h3>

              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Acción</th>
                    <th className="border p-2">Usuario</th>
                    <th className="border p-2">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">Creación</td>
                    <td className="border p-2">{selectedArea.nombreCompleto_C ?? "—"}</td>
                    <td className="border p-2">
                      {selectedArea.are_FechaCreacion
                        ? new Date(selectedArea.are_FechaCreacion).toLocaleString("es-HN")
                        : "—"}
                    </td>
                  </tr>

                  <tr>
                    <td className="border p-2">Modificación</td>
                    <td className="border p-2">{selectedArea.nombreCompleto_M ?? "—"}</td>
                    <td className="border p-2">
                      {selectedArea.are_FechaModificacion
                        ? new Date(selectedArea.are_FechaModificacion).toLocaleString("es-HN")
                        : "—"}
                    </td>
                  </tr>

                  <tr>
                    <td className="border p-2">Eliminación</td>
                    <td className="border p-2">{selectedArea.nombreCompleto_E ?? "—"}</td>
                    <td className="border p-2">
                      {selectedArea.are_FechaEliminacion
                        ? new Date(selectedArea.are_FechaEliminacion).toLocaleString("es-HN")
                        : "—"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Seguro que querés eliminar el área{" "}
              <span className="font-semibold text-red-600">
                {areaToDelete?.are_Nombre}
              </span>
              ? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>

            <AlertDialogAction
              className="bg-[#004aad] hover:bg-[#003687]"
              onClick={async () => {
                if (areaToDelete) {
                  await handleDeleteArea(areaToDelete);
                  setIsDeleteDialogOpen(false);
                }
              }}
            >
              Sí, Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}