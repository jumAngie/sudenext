import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from "../../context/AuthContext";
import { Role } from '../../types';
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
import { Eye, Pencil, Trash2, Plus, Search, Filter, Shield } from 'lucide-react';
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

export function RolesPage() {
  const { user } = useAuth();

  const { roles, addRole, updateRole, deleteRole } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [roleToDelete, setroleToDelete] = useState<Role | null>(null);

  // Páginación
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    role_ID: 0,
    rol_Descripcion: ''
  });

  // Validaciones
  const [formError, setFormError] = useState("");
  const [editFormError, setEditFormError] = useState("");

  const filteredRoles = roles.filter((role) => {
    const matchesSearch = role.rol_Descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && role.rol_Estado) ||
      (statusFilter === 'inactive' && !role.rol_Estado);
    return matchesSearch && matchesStatus;
  });

  // Paginación
  const totalRecords = filteredRoles.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRoles.slice(indexOfFirstRecord, indexOfLastRecord);

  // CREAR
  const handleCreateRole = async () => {
    // Validación en blanco
    if (!formData.rol_Descripcion.trim()) {
      setFormError("El nombre es obligatorio.");
      toast.error("El nombre del área no puede estar vacío.");
      return;
    }
    const message = await addRole({
      rol_Descripcion: formData.rol_Descripcion,
      usu_UsuarioCreacion: Number(user?.data?.id),
      rol_FechaCreacion: getLocalDateTime(),
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
    setFormData({
      role_ID: 0,
      rol_Descripcion: ''
    });
    setFormError("");
  };

  // EDITAR
  const handleEditRole = async () => {
    if (!formData.rol_Descripcion.trim()) {
      setEditFormError("El nombre no puede estar vacío.");
      toast.error("El nombre no puede estar vacío.");
      return;
    }
    if (selectedRole) {
      const message = await updateRole(selectedRole.rol_ID, {
        rol_ID: selectedRole.rol_ID,
        rol_Descripcion: formData.rol_Descripcion,
        usu_UsuarioModificacion: Number(user?.data?.id),
        rol_FechaModificacion: getLocalDateTime()
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
      setSelectedRole(null);
      setFormData({
        role_ID: 0,
        rol_Descripcion: ''
      });
    }
  };

  const handleDeleteRole = async () => {
    if (!roleToDelete) return;
    const message = await deleteRole(roleToDelete.rol_ID, {
      rol_ID: roleToDelete.rol_ID,
      usu_UsuarioEliminacion: Number(user?.data?.id),
      rol_FechaEliminacion: getLocalDateTime(),
      rol_Descripcion: "string"
    });

    if (!message.toLowerCase().includes("exitosamente")) {
      toast.error(message);
      return;
    }
    toast.success(message);
    setIsDeleteDialogOpen(false);
    setroleToDelete(null);
  };

  const openCreateDialog = () => {
    setFormData({
      role_ID: 0,
      rol_Descripcion: ''
    });
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (role: Role) => {
    setSelectedRole(role);
    setFormData({
      role_ID: role.rol_ID,
      rol_Descripcion: role.rol_Descripcion,
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (role: Role) => {
    setSelectedRole(role);
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
            <Shield className="w-5 h-5" />
            Gestión de Roles
          </CardTitle>
          <CardDescription>
            Administración de roles del sistema
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
                Crear Rol
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

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Roles ({filteredRoles.length} de {roles.length})
          </CardTitle>
          <CardDescription>
            Lista completa de todos los roles registrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRoles.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron roles con los filtros aplicados</p>
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
                {currentRecords.map((role) => (
                  <TableRow key={role.rol_ID} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {role.rol_ID}
                    </TableCell>
                    <TableCell className="font-medium">{role.rol_Descripcion}</TableCell>
                    <TableCell>
                      {role.nombreCompleto_C ?? "—"}
                    </TableCell>
                    <TableCell>
                      {role.rol_FechaCreacion
                        ? new Date(role.rol_FechaCreacion).toLocaleDateString("es-HN")
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={role.rol_Estado ? 'default' : 'secondary'} className={role.rol_Estado ? 'bg-green-600' : ''}>
                        {role.rol_Estado ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openViewDialog(role)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Ver Detalles
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(role)}
                          className="text-[#edba0d] hover:text-[#d4a50c] hover:bg-yellow-50"
                        >
                          <Pencil className="w-3 h-3 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setroleToDelete(role);
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
            setFormData({
              role_ID: 0,
              rol_Descripcion: ''
            });
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Rol</DialogTitle>
            <DialogDescription>
              Ingrese los datos del rol a crear
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                value={formData.rol_Descripcion}
                onChange={(e) => {
                  setFormData({ ...formData, rol_Descripcion: e.target.value });
                  setFormError("");  // quitar error cuando el usuario escribe
                }}
                placeholder="Ej: Administrador"
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
              setFormError("");
              setFormData({
                role_ID: 0,
                rol_Descripcion: ''
              });
            }}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreateRole} className="bg-[#004aad] hover:bg-[#003687]">
              Crear Rol
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
            setFormData({
              role_ID: 0,
              rol_Descripcion: ''
            });
          }
        }}
      ><DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Rol</DialogTitle>
            <DialogDescription>
              Modifique los datos del rol
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nombre</Label>
              <Input
                id="edit-name"
                value={formData.rol_Descripcion}
                onChange={(e) => {
                  setFormData({ ...formData, rol_Descripcion: e.target.value });
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
              setFormData({
                role_ID: 0,
                rol_Descripcion: ''
              });
            }}
            > Cancelar
            </Button>
            <Button onClick={handleEditRole} className="bg-[#004aad] hover:bg-[#003687]">
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles del Rol</DialogTitle>
          </DialogHeader>
          {selectedRole && (
            <div className="space-y-8 py-4">
              {/* GRID DE 2 COLUMNAS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <Label className="text-gray-600">Nombre</Label>
                  <p className="mt-1">{selectedRole.rol_Descripcion}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Estado</Label>
                  <div className="mt-1">
                    <Badge
                      variant={selectedRole.rol_Estado ? "default" : "secondary"}
                      className={selectedRole.rol_Estado ? "bg-green-600" : ""}
                    >
                      {selectedRole.rol_Estado ? "Activo" : "Inactivo"}
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
                    <td className="border p-2">{selectedRole.nombreCompleto_C ?? "—"}</td>
                    <td className="border p-2">
                      {selectedRole.rol_FechaCreacion
                        ? new Date(selectedRole.rol_FechaCreacion).toLocaleString("es-HN")
                        : "—"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2">Modificación</td>
                    <td className="border p-2">{selectedRole.nombreCompleto_M ?? "—"}</td>
                    <td className="border p-2">
                      {selectedRole.rol_FechaModificacion
                        ? new Date(selectedRole.rol_FechaModificacion).toLocaleString("es-HN")
                        : "—"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2">Eliminación</td>
                    <td className="border p-2">{selectedRole.nombreCompleto_E ?? "—"}</td>
                    <td className="border p-2">
                      {selectedRole.rol_FechaEliminacion
                        ? new Date(selectedRole.rol_FechaEliminacion).toLocaleString("es-HN")
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
                {roleToDelete?.rol_Descripcion}
              </span>
              ? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-[#004aad] hover:bg-[#003687]"
              onClick={async () => {
                if (roleToDelete) {
                  await handleDeleteRole();
                  setIsDeleteDialogOpen(false);
                }
              }}
            >
              Sí, Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div >
  );
}