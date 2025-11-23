import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from "../../context/AuthContext";
import { SystemUser } from '../../types';
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
import { Eye, Pencil, Trash2, Plus, Search, Filter, UserCog, EyeClosed } from 'lucide-react';
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

export function UsersPage() {
  const { user } = useAuth();

  const { systemUsers, addSystemUser, updateSystemUser, deleteSystemUser, roles } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [systemUserToDelete, setSystemUserToDelete] = useState<SystemUser | null>(null);
  // Páginación
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [formData, setFormData] = useState({
    usu_ID: 0,
    usu_Usuario: '',
    usu_Contrasena: '',
    per_ID: 0,
    rol_ID: 0
  });

  // DDL
  const { personalSinUsuario } = useData();
  const [selectedPersonal, setSelectedPersonal] = useState(null);

  // Validaciones
  const [formError, setFormError] = useState("");
  const [editFormError, setEditFormError] = useState("");

  const filteredUsers = systemUsers.filter((user) => {
    const matchesSearch = user.usu_Usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.per_Nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.rol_Descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.rol_Descripcion === roleFilter;
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && user.usu_Estado) ||
      (statusFilter === 'inactive' && !user.usu_Estado);
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Paginación
  const totalRecords = filteredUsers.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredUsers.slice(indexOfFirstRecord, indexOfLastRecord);

  // CREAR
  const handleCreateUser = async () => {
    if (!selectedPersonal || !formData.rol_ID || !formData.usu_Usuario.trim() || !formData.usu_Contrasena.trim()) {
      toast.error("Debe llenar todos los campos");
      return;
    }
    const message = await addSystemUser({
      usu_Usuario: formData.usu_Usuario,
      usu_Contrasena: formData.usu_Contrasena,
      per_ID: formData.per_ID,
      rol_ID: formData.rol_ID,
      usu_UsuarioCreacion: Number(user?.data?.id),
      usu_FechaCreacion: getLocalDateTime(),
    });
    if (!message.toLowerCase().includes("correctamente")) {
      setFormError(message);
      toast.error(message);
      return;
    }
    toast.success(message);
    setIsCreateDialogOpen(false);
    setFormData({
      usu_ID: 0,
      usu_Usuario: '',
      usu_Contrasena: '',
      per_ID: 0,
      rol_ID: 0
    });
    setFormError("");
  };

  // EDITAR
  const handleEditUser = async () => {
    if (selectedUser) {
      if (!selectedUser.usu_Usuario || !selectedUser.per_ID || !selectedUser.rol_ID || !selectedPersonal) {
        toast.error("Debe llenar todos los campos");
        return;
      }

      const message = await updateSystemUser(
        selectedUser.usu_ID, {
        usu_ID: selectedUser.usu_ID,
        usu_Usuario: formData.usu_Usuario,
        usu_Contrasena: '',
        per_ID: formData.per_ID,
        rol_ID: formData.rol_ID,
        usu_UsuarioModificacion: Number(user?.data?.id),
        usu_FechaModificacion: getLocalDateTime(),
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
      setSelectedUser(null);
      setFormData({
        usu_ID: 0,
        usu_Usuario: '',
        usu_Contrasena: '',
        per_ID: 0,
        rol_ID: 0
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!systemUserToDelete) return;
    const message = await deleteSystemUser(systemUserToDelete.usu_ID, {
      usu_ID: systemUserToDelete.usu_ID,
      usu_UsuarioEliminacion: Number(user?.data?.id),
      usu_FechaEliminacion: getLocalDateTime(),
      usu_Usuario: '',
      usu_Contrasena: ''
    });

    if (!message.toLowerCase().includes("exitosamente")) {
      toast.error(message);
      return;
    }
    toast.success(message);
    setIsDeleteDialogOpen(false);
    setSystemUserToDelete(null);
  };

  const openCreateDialog = () => {
    setFormData({
      usu_ID: 0,
      usu_Usuario: '',
      usu_Contrasena: '',
      per_ID: 0,
      rol_ID: 0
    });
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (user: SystemUser) => {
    setSelectedUser(user);
    setFormData({
      usu_ID: 0,
      usu_Usuario: '',
      usu_Contrasena: '',
      per_ID: 0,
      rol_ID: 0
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (user: SystemUser) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setStatusFilter('all');
    toast.success('Filtros limpiados');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-[#004aad]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#004aad]">
            <UserCog className="w-5 h-5" />
            Gestión de Usuarios
          </CardTitle>
          <CardDescription>
            Administración de usuarios del sistema
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
                Crear Usuario
              </Button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nombre, email o rol..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Rol</label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
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

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Usuarios ({filteredUsers.length} de {systemUsers.length})
          </CardTitle>
          <CardDescription>
            Lista completa de todos los usuarios registrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <UserCog className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron usuarios con los filtros aplicados</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Fecha Creación</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRecords.map((user) => (
                  <TableRow key={user.usu_ID} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {user.usu_ID}
                    </TableCell>
                    <TableCell className="font-medium">{user.usu_Usuario}</TableCell>
                    <TableCell>{user.per_Nombres}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.rol_Descripcion}</Badge>
                    </TableCell>
                    <TableCell>
                      {user.usu_FechaCreacion
                        ? new Date(user.usu_FechaCreacion).toLocaleDateString("es-HN")
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.usu_Estado ? 'default' : 'secondary'} className={user.usu_Estado ? 'bg-green-600' : ''}>
                        {user.usu_Estado ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openViewDialog(user)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Ver Detalles
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(user)}
                          className="text-[#edba0d] hover:text-[#d4a50c] hover:bg-yellow-50"
                        >
                          <Pencil className="w-3 h-3 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSystemUserToDelete(user);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <EyeClosed className="w-3 h-3 mr-1" />
                          Desactivar
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
            <DialogTitle>Crear Nuevo Usuario</DialogTitle>
            <DialogDescription>
              Ingrese los datos del usuario a crear
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateUser} className="bg-[#004aad] hover:bg-[#003687]">
              Crear Usuario
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>
              Modifique los datos del usuario
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditUser} className="bg-[#004aad] hover:bg-[#003687]">
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles del Usuario</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-8 py-4">
              {/* GRID DE 2 COLUMNAS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <Label className="text-gray-600">Nombre Completo</Label>
                  <p className="mt-1">{selectedUser.per_Nombres}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Correo</Label>
                  <p className="mt-1">{selectedUser.usu_Usuario}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <Label className="text-gray-600">Rol</Label>
                  <p className="mt-1">{selectedUser.rol_Descripcion}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Estado</Label>
                  <div className="mt-1">
                    <Badge
                      variant={selectedUser.usu_Estado ? "default" : "secondary"}
                      className={selectedUser.usu_Estado ? "bg-green-600" : ""}
                    >
                      {selectedUser.usu_Estado ? "Activo" : "Inactivo"}
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
                    <td className="border p-2">{selectedUser.nombreCompleto_C ?? "—"}</td>
                    <td className="border p-2">
                      {selectedUser.usu_FechaCreacion
                        ? new Date(selectedUser.usu_FechaCreacion).toLocaleString("es-HN")
                        : "—"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2">Modificación</td>
                    <td className="border p-2">{selectedUser.nombreCompleto_M ?? "—"}</td>
                    <td className="border p-2">
                      {selectedUser.usu_FechaModificacion
                        ? new Date(selectedUser.usu_FechaModificacion).toLocaleString("es-HN")
                        : "—"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2">Eliminación</td>
                    <td className="border p-2">{selectedUser.nombreCompleto_E ?? "—"}</td>
                    <td className="border p-2">
                      {selectedUser.usu_FechaEliminacion
                        ? new Date(selectedUser.usu_FechaEliminacion).toLocaleString("es-HN")
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
              ¿Seguro que querés desactivar el registro{" "}
              <span className="font-semibold text-red-600">
                {systemUserToDelete?.usu_Usuario}
              </span>
              ? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-[#004aad] hover:bg-[#003687]"
              onClick={async () => {
                if (systemUserToDelete) {
                  await handleDeleteUser();
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
