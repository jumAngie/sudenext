import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StaffMember } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { User, Lock, Mail, Briefcase, Shield, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Badge } from '../ui/badge';

export function ProfilePage() {
  const { user, changePassword } = useAuth();
  const staffData = user?.data as StaffMember;
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getRoleLabel = (role: string) => {
    const roleLabels: Record<string, string> = {
      administrador: 'Administrador',
      odontologo: 'Odontólogo',
      medico_general: 'Médico General',
      asesor_academico: 'Asesor Académico',
      consejero: 'Consejero Psicológico',
    };
    return roleLabels[role] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      administrador: 'bg-purple-600',
      odontologo: 'bg-blue-600',
      medico_general: 'bg-green-600',
      asesor_academico: 'bg-orange-600',
      consejero: 'bg-pink-600',
    };
    return colors[role] || 'bg-gray-600';
  };

  const handleChangePassword = async () => {
    // Validaciones
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Todos los campos son requeridos');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Las contraseñas nuevas no coinciden');
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      toast.error('La nueva contraseña debe ser diferente a la actual');
      return;
    }

    // Intentar cambiar la contraseña
    const success = await changePassword(passwordData.currentPassword, passwordData.newPassword);

    if (success) {
      toast.success('Contraseña cambiada exitosamente');
      setIsChangePasswordDialogOpen(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } else {
      toast.error('La contraseña actual es incorrecta');
    }
  };

  const openChangePasswordDialog = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setIsChangePasswordDialogOpen(true);
  };

  if (!staffData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-[#edba0d]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#004aad]">
            <User className="w-5 h-5" />
            Mi Perfil
          </CardTitle>
          <CardDescription>
            Información personal y configuración de cuenta
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Profile Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-600 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Nombre de Usuario (Correo Electrónico)
              </Label>
              <div className="p-3 bg-gray-50 rounded-md border">
                <p className="font-medium">{staffData.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-600 flex items-center gap-2">
                <User className="w-4 h-4" />
                Nombre Completo
              </Label>
              <div className="p-3 bg-gray-50 rounded-md border">
                <p className="font-medium">{staffData.name}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-600 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Área
              </Label>
              <div className="p-3 bg-gray-50 rounded-md border">
                <p className="font-medium">{staffData.department}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-600 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Rol
              </Label>
              <div className="p-3 bg-gray-50 rounded-md border flex items-center gap-2">
                <Badge className={getRoleBadgeColor(staffData.role)}>
                  {getRoleLabel(staffData.role)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Seguridad
            </CardTitle>
            <CardDescription>
              Gestiona la seguridad de tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label className="text-gray-600">Contraseña</Label>
              <p className="text-sm text-gray-500">
                Cambia tu contraseña regularmente para mantener tu cuenta segura.
              </p>
              <Button
                onClick={openChangePasswordDialog}
                className="bg-[#004aad] hover:bg-[#003687] w-full"
              >
                <Lock className="w-4 h-4 mr-2" />
                Cambiar Contraseña
              </Button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h4 className="font-medium text-blue-900 mb-2">Recomendaciones de seguridad</h4>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Use una contraseña de al menos 6 caracteres</li>
                <li>Combine letras mayúsculas, minúsculas y números</li>
                <li>No comparta su contraseña con nadie</li>
                <li>Cambie su contraseña periódicamente</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Información Adicional</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-600">ID de Usuario</Label>
              <div className="p-3 bg-gray-50 rounded-md border">
                <p className="font-mono text-sm">{staffData.id}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-600">Tipo de Cuenta</Label>
              <div className="p-3 bg-gray-50 rounded-md border">
                <Badge variant="outline">Personal SUDENEXT</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-600">Estado de Cuenta</Label>
              <div className="p-3 bg-gray-50 rounded-md border">
                <Badge className="bg-green-600">Activa</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Dialog */}
      <Dialog open={isChangePasswordDialogOpen} onOpenChange={setIsChangePasswordDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cambiar Contraseña</DialogTitle>
            <DialogDescription>
              Ingrese su contraseña actual y la nueva contraseña
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Contraseña Actual</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Ingrese su contraseña actual"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">Nueva Contraseña</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Ingrese su nueva contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500">Mínimo 6 caracteres</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirme su nueva contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChangePasswordDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleChangePassword} className="bg-[#004aad] hover:bg-[#003687]">
              Cambiar Contraseña
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
