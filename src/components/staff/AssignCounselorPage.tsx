import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { useData } from "../../context/DataContext";
import { SupportSession } from "../../types";
import {
  Heart,
  Clock,
  Calendar,
  User,
  CheckCircle,
  X,
  UserCheck,
  Edit,
  History,
  MapPin,
} from "lucide-react";
import { toast } from "sonner@2.0.3";

// Mock counselors data
const mockCounselors = [
  {
    id: "staff-5",
    name: "Psic. Marco Sandoval",
    specialty: "Ansiedad y Estrés",
  },
  {
    id: "staff-6",
    name: "Psic. Ana María Flores",
    specialty: "Depresión y Autoestima",
  },
  {
    id: "staff-7",
    name: "Psic. Carlos Mendoza",
    specialty: "Orientación Vocacional",
  },
];

interface EditAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: SupportSession | null;
  onSave: (newCounselorId: string) => void;
}

function EditAssignmentModal({
  isOpen,
  onClose,
  session,
  onSave,
}: EditAssignmentModalProps) {
  const [newCounselorId, setNewCounselorId] = useState("");

  React.useEffect(() => {
    if (session) {
      setNewCounselorId(session.assignedCounselorId || "");
    }
  }, [session]);

  const handleSave = () => {
    if (!newCounselorId) {
      toast.error("Debes seleccionar un consejero");
      return;
    }
    onSave(newCounselorId);
    onClose();
  };

  if (!session) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-[#004aad]" />
            Editar Asignación de Consejero
          </DialogTitle>
          <DialogDescription>
            Modifica la asignación del consejero para esta
            sesión de apoyo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Session Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-[#004aad] mb-3">
              Información de la Sesión
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">
                  Estudiante:
                </span>
                <p className="font-medium">
                  {session.studentName}
                </p>
              </div>
              <div>
                <span className="text-gray-600">
                  No. Cuenta:
                </span>
                <p className="font-medium">
                  {session.accountNumber}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Estado:</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {session.status}
                </Badge>
              </div>
              <div>
                <span className="text-gray-600">
                  Modalidad:
                </span>
                <p className="font-medium">
                  {session.modality}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <span className="text-gray-600">
                Motivo Principal:
              </span>
              <p className="font-medium">
                {session.mainReason}
              </p>
            </div>
            <div className="mt-2">
              <span className="text-gray-600">
                Consejero Actual:
              </span>
              <p className="font-medium text-blue-600">
                {session.assignedCounselorName}
              </p>
            </div>
          </div>

          {/* New Counselor Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Nuevo Consejero Asignado
            </label>
            <Select
              value={newCounselorId}
              onValueChange={setNewCounselorId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un consejero" />
              </SelectTrigger>
              <SelectContent>
                {mockCounselors.map((counselor) => (
                  <SelectItem
                    key={counselor.id}
                    value={counselor.id}
                  >
                    <div>
                      <p className="font-medium">
                        {counselor.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {counselor.specialty}
                      </p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#004aad] hover:bg-[#003687] text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function AssignCounselorPage() {
  const { supportSessions, updateSupportSession } = useData();
  const [selectedSession, setSelectedSession] =
    useState<SupportSession | null>(null);
  const [editingSession, setEditingSession] =
    useState<SupportSession | null>(null);
  const [assignedCounselor, setAssignedCounselor] =
    useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const pendingSessions = supportSessions.filter(
    (s) => s.status === "pendiente",
  );
  const assignedSessions = supportSessions.filter(
    (s) => s.status === "asignada" || s.status === "completada",
  );

  const handleAssignSession = (session: SupportSession) => {
    setSelectedSession(session);
    setAssignedCounselor("");
    setRejectionReason("");
    setIsAssigning(false);
  };

  const handleEditAssignment = (session: SupportSession) => {
    setEditingSession(session);
    setShowEditModal(true);
  };

  const confirmAssignment = () => {
    if (!selectedSession || !assignedCounselor) {
      toast.error("Debes seleccionar un consejero");
      return;
    }

    const counselor = mockCounselors.find(
      (c) => c.id === assignedCounselor,
    );
    if (!counselor) return;

    updateSupportSession(selectedSession.id, {
      status: "asignada",
      assignedCounselorId: assignedCounselor,
      assignedCounselorName: counselor.name,
      scheduledAt: new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      ).toISOString(), // Schedule for tomorrow
    });

    toast.success("Sesión asignada correctamente");
    setSelectedSession(null);
  };

  const saveEditAssignment = (newCounselorId: string) => {
    if (!editingSession) return;

    const newCounselor = mockCounselors.find(
      (c) => c.id === newCounselorId,
    );
    if (!newCounselor) return;

    updateSupportSession(editingSession.id, {
      assignedCounselorId: newCounselorId,
      assignedCounselorName: newCounselor.name,
    });

    toast.success("Asignación actualizada correctamente");
    setEditingSession(null);
  };

  const rejectSession = () => {
    if (!selectedSession) return;

    if (!rejectionReason.trim()) {
      toast.error(
        "Debes proporcionar una razón para el rechazo",
      );
      return;
    }

    updateSupportSession(selectedSession.id, {
      status: "rechazada",
    });

    toast.success("Solicitud rechazada");
    setSelectedSession(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-HN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getEmotionalLevelText = (level: number) => {
    const levels = {
      1: "Muy Bajo",
      2: "Bajo",
      3: "Moderado",
      4: "Alto",
      5: "Muy Alto",
    };
    return levels[level as keyof typeof levels] || "N/A";
  };

  const getEmotionalLevelColor = (level: number) => {
    if (level <= 2) return "bg-green-100 text-green-800";
    if (level === 3) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "asignada":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            Asignada
          </Badge>
        );
      case "completada":
        return (
          <Badge className="bg-green-100 text-green-800">
            Completada
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-[#004aad]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#004aad]">
            <UserCheck className="w-5 h-5" />
            Asignación de Consejeros
          </CardTitle>
          <CardDescription>
            Revisa las solicitudes de sesiones de apoyo y asigna
            consejeros apropiados
          </CardDescription>
        </CardHeader>
      </Card>
    {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Solicitudes Pendientes
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingSessions.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sesiones Asignadas
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                supportSessions.filter(
                  (s) => s.status === "asignada",
                ).length
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sesiones Completadas
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                supportSessions.filter(
                  (s) => s.status === "completada",
                ).length
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Consejeros Disponibles
            </CardTitle>
            <User className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockCounselors.length}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Pending Sessions Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Solicitudes Pendientes de Asignación
          </CardTitle>
          <CardDescription>
            Sesiones de apoyo que requieren asignación de
            consejero
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingSessions.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                No hay solicitudes pendientes
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>No. Cuenta</TableHead>
                  <TableHead>Motivo Principal</TableHead>
                  <TableHead>Nivel Emocional</TableHead>
                  <TableHead>Modalidad</TableHead>
                  <TableHead>Hora Preferida</TableHead>
                  <TableHead>Fecha Solicitud</TableHead>
                  <TableHead className="text-right">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingSessions.map((session) => (
                  <TableRow
                    key={session.id}
                    className="hover:bg-gray-50"
                  >
                    <TableCell className="font-medium">
                      {session.studentName}
                    </TableCell>
                    <TableCell className="font-mono">
                      {session.accountNumber}
                    </TableCell>
                    <TableCell className="max-w-64">
                      <p
                        className="truncate"
                        title={session.mainReason}
                      >
                        {session.mainReason}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getEmotionalLevelColor(
                          session.emotionalLevel,
                        )}
                      >
                        {getEmotionalLevelText(
                          session.emotionalLevel,
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="capitalize">
                          {session.modality}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {session.preferredTime}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(session.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() =>
                          handleAssignSession(session)
                        }
                        className="bg-[#004aad] hover:bg-[#003687] text-white"
                      >
                        <UserCheck className="w-3 h-3 mr-1" />
                        Asignar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      {/* Assigned Sessions History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Historial de Solicitudes Asignadas
          </CardTitle>
          <CardDescription>
            Sesiones ya asignadas a consejeros con opción de
            editar la asignación
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assignedSessions.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                No hay sesiones asignadas aún
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>No. Cuenta</TableHead>
                  <TableHead>Motivo Principal</TableHead>
                  <TableHead>Consejero Asignado</TableHead>
                  <TableHead>Modalidad</TableHead>
                  <TableHead>Fecha Programada</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignedSessions.map((session) => (
                  <TableRow
                    key={session.id}
                    className="hover:bg-gray-50"
                  >
                    <TableCell className="font-medium">
                      {session.studentName}
                    </TableCell>
                    <TableCell className="font-mono">
                      {session.accountNumber}
                    </TableCell>
                    <TableCell className="max-w-64">
                      <p
                        className="truncate"
                        title={session.mainReason}
                      >
                        {session.mainReason}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 text-blue-600" />
                        <span className="text-blue-600 font-medium">
                          {session.assignedCounselorName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="capitalize">
                          {session.modality}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {session.scheduledAt
                          ? formatDate(session.scheduledAt)
                          : "Por programar"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(session.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      {session.status === "asignada" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleEditAssignment(session)
                          }
                          className="text-[#004aad] border-[#004aad] hover:bg-[#004aad] hover:text-white"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Editar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      {/* Assignment Dialog */}
      <Dialog
        open={!!selectedSession}
        onOpenChange={() => setSelectedSession(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#004aad]" />
              Asignar Consejero
            </DialogTitle>
            <DialogDescription>
              Revisa la información del estudiante y asigna el
              consejero más apropiado
            </DialogDescription>
          </DialogHeader>

          {selectedSession && (
            <div className="space-y-6">
              {/* Student Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-[#004aad] mb-3">
                  Información del Estudiante
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">
                      Nombre:
                    </span>
                    <p className="font-medium">
                      {selectedSession.studentName}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">
                      No. Cuenta:
                    </span>
                    <p className="font-medium">
                      {selectedSession.accountNumber}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">
                      Nivel de Malestar:
                    </span>
                    <p className="font-medium">
                      {getEmotionalLevelText(
                        selectedSession.emotionalLevel,
                      )}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">
                      Modalidad:
                    </span>
                    <p className="font-medium">
                      {selectedSession.modality}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-gray-600">
                    Motivo Principal:
                  </span>
                  <p className="font-medium">
                    {selectedSession.mainReason}
                  </p>
                </div>
                {selectedSession.additionalComments && (
                  <div className="mt-3">
                    <span className="text-gray-600">
                      Comentarios Adicionales:
                    </span>
                    <p className="font-medium">
                      {selectedSession.additionalComments}
                    </p>
                  </div>
                )}
              </div>

              {!isAssigning ? (
                <>
                  {/* Counselor Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">
                      Seleccionar Consejero
                    </label>
                    <Select
                      value={assignedCounselor}
                      onValueChange={setAssignedCounselor}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un consejero" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCounselors.map((counselor) => (
                          <SelectItem
                            key={counselor.id}
                            value={counselor.id}
                          >
                            <div>
                              <p className="font-medium">
                                {counselor.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {counselor.specialty}
                              </p>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between pt-4 border-t">
                    <Button
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => setIsAssigning(true)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Rechazar Solicitud
                    </Button>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedSession(null)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={confirmAssignment}
                        className="bg-[#004aad] hover:bg-[#003687] text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Confirmar Asignación
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Rejection Form */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-red-600">
                      Razón del Rechazo
                    </label>
                    <Textarea
                      placeholder="Explica por qué se rechaza esta solicitud..."
                      value={rejectionReason}
                      onChange={(e) =>
                        setRejectionReason(e.target.value)
                      }
                      rows={4}
                    />
                  </div>

                  {/* Rejection Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setIsAssigning(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={rejectSession}
                      variant="destructive"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Confirmar Rechazo
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Edit Assignment Modal */}
      <EditAssignmentModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        session={editingSession}
        onSave={saveEditAssignment}
      />
    </div>
  );
}