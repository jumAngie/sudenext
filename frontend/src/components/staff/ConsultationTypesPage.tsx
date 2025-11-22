import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from "../../context/AuthContext";
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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "../ui/alert-dialog"
import { toast } from "sonner";
import { getLocalDateTime } from '../../utils/dateHelpers';

export function ConsultationTypesPage() {
  const { user } = useAuth();

  const { consultationTypes, addConsultationType, updateConsultationType, deleteConsultationType } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [consultationTypeToDelete, setconsultationTypeToDelete] = useState<ConsultationType | null>(null);

  // Páginación
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [selectedType, setSelectedType] = useState<ConsultationType | null>(null);
  const [formData, setFormData] = useState({
    tic_ID: 0,
    tic_Descripcion: ''
  });

  // Validaciones
  const [formError, setFormError] = useState("");
  const [editFormError, setEditFormError] = useState("");

  const filteredTypes = consultationTypes.filter((type) => {
    const matchesSearch = type.tic_Descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && type.tic_Estado) ||
      (statusFilter === 'inactive' && !type.tic_Estado);
    return matchesSearch && matchesStatus;
  });

  // Paginación
  const totalRecords = filteredTypes.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredTypes.slice(indexOfFirstRecord, indexOfLastRecord);

  //CREAR
  const handleCreateType = async () => {
    // Validación en blanco
    if (!formData.tic_Descripcion.trim()) {
      setFormError("El nombre es obligatorio.");
      toast.error("El nombre del área no puede estar vacío.");
      return;
    }
    const message = await addConsultationType({
      tic_Descripcion: formData.tic_Descripcion,
      usu_UsuarioCreacion: Number(user?.data?.id),
      tic_FechaCreacion: getLocalDateTime(),
    });
    // Si el backend dice error
    if (!message.toLowerCase().includes("correctamente")) {
      setFormError(message);
      toast.error(message);
      return;
    }
    // Si fue exitoso
    toast.success(message);
    setIsCreateDialogOpen(false);
    setFormData({ tic_ID: 0, tic_Descripcion: "" });
    setFormError("");
  };

  // EDITAR
  const handleEditType = async () => {
    if (!formData.tic_Descripcion.trim()) {
      setEditFormError("El nombre no puede estar vacío.");
      toast.error("El nombre no puede estar vacío.");
      return;
    }
    if (selectedType) {
      const message = await updateConsultationType(selectedType.tic_ID, {
        tic_ID: selectedType.tic_ID,
        tic_Descripcion: formData.tic_Descripcion,
        usu_UsuarioModificacion: Number(user?.data?.id),
        tic_FechaModificacion: getLocalDateTime()
      });
      // Si el SP devolvió error
      if (!message.toLowerCase().includes("correctamente")) {
        setEditFormError(message);
        toast.error(message);
        return;
      }
      // Si el SP devolvió éxito
      toast.success(message);
      setIsEditDialogOpen(false);
      setEditFormError("");
      setSelectedType(null);
      setFormData({ tic_ID: 0, tic_Descripcion: "" });
    }
  };

  // ELIMINAR
  const handleDeleteType = async () => {
    if (!consultationTypeToDelete) return;
    const message = await deleteConsultationType(consultationTypeToDelete.tra_ID, {
      tic_ID: consultationTypeToDelete.tic_ID,
      usu_UsuarioEliminacion: Number(user?.data?.id),
      tic_FechaEliminacion: getLocalDateTime(),
      tic_Descripcion: "string"
    });
    if (!message.toLowerCase().includes("exitosamente")) {
      toast.error(message);
      return;
    }
    toast.success(message);
    setIsDeleteDialogOpen(false);
    setconsultationTypeToDelete(null);
  };

  const openCreateDialog = () => {
    setFormData({ tic_ID: 0, tic_Descripcion: '' });
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (type: ConsultationType) => {
    setSelectedType(type);
    setFormData({
      tic_ID: type.tic_ID,
      tic_Descripcion: type.tic_Descripcion
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
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Usuario Creador</TableHead>
                  <TableHead>Fecha Creación</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRecords.map((type) => (
                  <TableRow key={type.tic_ID} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {type.tic_ID}
                    </TableCell>
                    <TableCell className="font-medium">{type.tic_Descripcion}</TableCell>
                    <TableCell>
                      {type.nombreCompleto_C ?? "—"}
                    </TableCell>
                    <TableCell>
                      {type.tic_FechaCreacion
                        ? new Date(type.tic_FechaCreacion).toLocaleDateString("es-HN")
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={type.tic_Estado ? 'default' : 'secondary'} className={type.tic_Estado ? 'bg-green-600' : ''}>
                        {type.tic_Estado ? 'Activo' : 'Inactivo'}
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
                          onClick={() => {
                            setconsultationTypeToDelete(type);
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
      <Dialog
        open={isCreateDialogOpen}
        onOpenChange={(open: any) => {
          setIsCreateDialogOpen(open);
          if (!open) {
            setFormError("");
            setFormData({ tic_ID: 0, tic_Descripcion: "" });
          }
        }}
      >
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
                value={formData.tic_Descripcion}
                onChange={(e) => {
                  setFormData({ ...formData, tic_Descripcion: e.target.value });
                  setFormError("");  // quitar error cuando el usuario escribe
                }}
                placeholder="Ej: Orientación Académica"
                className={`${formError ? "border-red-500" : ""}`}
              />
              {formError && (
                <p className="text-red-600 text-sm mt-1">{formError}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCreateDialogOpen(false);
              setFormError("");          // limpiar error
              setFormData({ tic_ID: 0, tic_Descripcion: "" }); // limpiar textbox
            }}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreateType} className="bg-[#004aad] hover:bg-[#003687]">
              Crear Tipo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open: any) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setEditFormError("");
            setFormData({ tic_ID: 0, tic_Descripcion: "" });
          }
        }}
      >
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
                value={formData.tic_Descripcion}
                onChange={(e) => {
                  setFormData({ ...formData, tic_Descripcion: e.target.value });
                  setEditFormError("");
                }}
                className={editFormError ? "border-red-500" : ""}
              />
              {editFormError && (
                <p className="text-red-600 text-sm mt-1">{editFormError}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              setEditFormError("");      // limpiar error
              setFormData({ tic_ID: 0, tic_Descripcion: "" });
            }}
            >
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
            <div className="space-y-8 py-4">
              {/* GRID DE 2 COLUMNAS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <Label className="text-gray-600">Nombre</Label>
                  <p className="mt-1">{selectedType.tic_Descripcion}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Estado</Label>
                  <div className="mt-1">
                    <Badge
                      variant={selectedType.tic_Estado ? "default" : "secondary"}
                      className={selectedType.tic_Estado ? "bg-green-600" : ""}
                    >
                      {selectedType.tic_Estado ? "Activo" : "Inactivo"}
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
                    <td className="border p-2">{selectedType.nombreCompleto_C ?? "—"}</td>
                    <td className="border p-2">
                      {selectedType.tic_FechaCreacion
                        ? new Date(selectedType.tic_FechaCreacion).toLocaleString("es-HN")
                        : "—"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2">Modificación</td>
                    <td className="border p-2">{selectedType.nombreCompleto_M ?? "—"}</td>
                    <td className="border p-2">
                      {selectedType.tic_FechaModificacion
                        ? new Date(selectedType.tic_FechaModificacion).toLocaleString("es-HN")
                        : "—"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2">Eliminación</td>
                    <td className="border p-2">{selectedType.nombreCompleto_E ?? "—"}</td>
                    <td className="border p-2">
                      {selectedType.tic_FechaEliminacion
                        ? new Date(selectedType.tic_FechaEliminacion).toLocaleString("es-HN")
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
              ¿Seguro que querés eliminar el registro{" "}
              <span className="font-semibold text-red-600">
                {consultationTypeToDelete?.tic_Descripcion}
              </span>
              ? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-[#004aad] hover:bg-[#003687]"
              onClick={async () => {
                if (consultationTypeToDelete) {
                  await handleDeleteType();
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