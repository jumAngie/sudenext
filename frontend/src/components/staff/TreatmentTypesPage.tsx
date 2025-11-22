import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from "../../context/AuthContext";
import { TreatmentType } from '../../types';
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
import { Eye, Pencil, Trash2, Plus, Search, Filter, Stethoscope } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';
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


export function TreatmentTypesPage() {
  const { user } = useAuth();

  const { treatmentTypes, addTreatmentType, updateTreatmentType, deleteTreatmentType } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [treatmentTypeToDelete, settreatmentTypeToDelete] = useState<TreatmentType | null>(null);

  // Páginación
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [selectedType, setSelectedType] = useState<TreatmentType | null>(null);
  const [formData, setFormData] = useState({
    tra_ID: 0,
    tra_Descripcion: ''
  });

  // Validaciones
  const [formError, setFormError] = useState("");
  const [editFormError, setEditFormError] = useState("");

  const filteredTypes = treatmentTypes.filter((type) => {
    const matchesSearch = type.tra_Descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && type.tra_Estado) ||
      (statusFilter === 'inactive' && !type.tra_Estado);
    return matchesSearch && matchesStatus;
  });

  // Paginación
  const totalRecords = filteredTypes.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredTypes.slice(indexOfFirstRecord, indexOfLastRecord);


  // CREAR
  const handleCreateType = async () => {
    // Validación en blanco
    if (!formData.tra_Descripcion.trim()) {
      setFormError("El nombre es obligatorio.");
      toast.error("El nombre del área no puede estar vacío.");
      return;
    }
    const message = await addTreatmentType({
      tra_Descripcion: formData.tra_Descripcion,
      usu_UsuarioCreacion: Number(user?.data?.id),
      tra_FechaCreacion: getLocalDateTime(),
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
    setFormData({ tra_ID: 0, tra_Descripcion: "" });
    setFormError("");
  };

  // EDITAR
  const handleEditType = async () => {
    if (!formData.tra_Descripcion.trim()) {
      setEditFormError("El nombre no puede estar vacío.");
      toast.error("El nombre no puede estar vacío.");
      return;
    }
    if (selectedType) {
      const message = await updateTreatmentType(selectedType.tra_ID, {
        tra_ID: selectedType.tra_ID,
        tra_Descripcion: formData.tra_Descripcion,
        usu_UsuarioModificacion: Number(user?.data?.id),
        tra_FechaModificacion: getLocalDateTime()
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
      setFormData({ tra_ID: 0, tra_Descripcion: "" });
    }
  };

  const handleDeleteType = async () => {
    if (!treatmentTypeToDelete) return;
    const message = await deleteTreatmentType(treatmentTypeToDelete.tra_ID, {
      tra_ID: treatmentTypeToDelete.tra_ID,
      usu_UsuarioEliminacion: Number(user?.data?.id),
      tra_FechaEliminacion: getLocalDateTime(),
      tra_Descripcion: "string"
    });

    if (!message.toLowerCase().includes("exitosamente")) {
      toast.error(message);
      return;
    }
    toast.success(message);
    setIsDeleteDialogOpen(false);
    settreatmentTypeToDelete(null);
  };

  const openCreateDialog = () => {
    setFormData({ tra_ID: 0, tra_Descripcion: '' });
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (type: TreatmentType) => {
    setSelectedType(type);
    setFormData({
      tra_ID: type.tra_ID,
      tra_Descripcion: type.tra_Descripcion
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (type: TreatmentType) => {
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
      <Card className="border-l-4 border-l-[#edba0d]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#004aad]">
            <Stethoscope className="w-5 h-5" />
            Tipos de Tratamiento Odontológico
          </CardTitle>
          <CardDescription>
            Gestión de tipos de tratamientos odontológicos
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

      {/* Treatment Types Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Tipos de Tratamiento ({filteredTypes.length} de {treatmentTypes.length})
          </CardTitle>
          <CardDescription>
            Lista completa de todos los tipos de tratamiento registrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTypes.length === 0 ? (
            <div className="text-center py-8">
              <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron tipos de tratamiento con los filtros aplicados</p>
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
                  <TableRow key={type.tra_ID} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {type.tra_ID}
                    </TableCell>
                    <TableCell className="font-medium">{type.tra_Descripcion}</TableCell>
                    <TableCell>
                      {type.nombreCompleto_C ?? "—"}
                    </TableCell>
                    <TableCell>
                      {type.tra_FechaCreacion
                        ? new Date(type.tra_FechaCreacion).toLocaleDateString("es-HN")
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={type.tra_Estado ? 'default' : 'secondary'} className={type.tra_Estado ? 'bg-green-600' : ''}>
                        {type.tra_Estado ? 'Activo' : 'Inactivo'}
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
                            settreatmentTypeToDelete(type);
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
            setFormData({ tra_ID: 0, tra_Descripcion: "" });
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Tipo de Tratamiento</DialogTitle>
            <DialogDescription>
              Ingrese los datos del tipo de tratamiento a crear
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                value={formData.tra_Descripcion}
                onChange={(e) => {
                  setFormData({ ...formData, tra_Descripcion: e.target.value });
                  setFormError("");  // quitar error cuando el usuario escribe
                }}
                placeholder="Ej: Endodoncia"
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
              setFormData({ tra_ID: 0, tra_Descripcion: "" }); // limpiar textbox
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
            setFormData({ tra_ID: 0, tra_Descripcion: "" });
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Tipo de Tratamiento</DialogTitle>
            <DialogDescription>
              Modifique los datos del tipo de tratamiento
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="edit-name">Nombre</Label>
              <Input
                id="edit-name"
                value={formData.tra_Descripcion}
                onChange={(e) => {
                  setFormData({ ...formData, tra_Descripcion: e.target.value });
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
              setFormData({ tra_ID: 0, tra_Descripcion: "" });
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
            <DialogTitle>Detalles del Tipo de Tratamiento</DialogTitle>
          </DialogHeader>
          {selectedType && (
            <div className="space-y-8 py-4">
              {/* GRID DE 2 COLUMNAS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <Label className="text-gray-600">Nombre</Label>
                  <p className="mt-1">{selectedType.tra_Descripcion}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Estado</Label>
                  <div className="mt-1">
                    <Badge
                      variant={selectedType.tra_Estado ? "default" : "secondary"}
                      className={selectedType.tra_Estado ? "bg-green-600" : ""}
                    >
                      {selectedType.tra_Estado ? "Activo" : "Inactivo"}
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
                      {selectedType.tra_FechaCreacion
                        ? new Date(selectedType.tra_FechaCreacion).toLocaleString("es-HN")
                        : "—"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2">Modificación</td>
                    <td className="border p-2">{selectedType.nombreCompleto_M ?? "—"}</td>
                    <td className="border p-2">
                      {selectedType.tra_FechaModificacion
                        ? new Date(selectedType.tra_FechaModificacion).toLocaleString("es-HN")
                        : "—"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2">Eliminación</td>
                    <td className="border p-2">{selectedType.nombreCompleto_E ?? "—"}</td>
                    <td className="border p-2">
                      {selectedType.tra_FechaEliminacion
                        ? new Date(selectedType.tra_FechaEliminacion).toLocaleString("es-HN")
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
                {treatmentTypeToDelete?.tra_Descripcion}
              </span>
              ? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-[#004aad] hover:bg-[#003687]"
              onClick={async () => {
                if (treatmentTypeToDelete) {
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