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
  MapPin,
  Eye,
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

export function AssignCounselorPage() {
  const { personalConsejero } = useData();
  const [selectedPersonal, setSelectedPersonal] = useState(null);
  
  const { supportSessions, updateSupportSession } = useData();
  const [selectedSession, setSelectedSession] =
    useState<SupportSession | null>(null);
  const [assignedCounselor, setAssignedCounselor] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [viewSession, setViewSession] = useState<SupportSession | null>(null);

  const handleAssignOrEdit = (session: SupportSession) => {
    setSelectedSession(session);
    setAssignedCounselor(session.assignedCounselorId || "");
    setRejectionReason("");
    setIsAssigning(false);
  };

  const handleViewDetails = (session: SupportSession) => {
    setViewSession(session);
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
      ).toISOString(),
    });

    toast.success(
      selectedSession.assignedCounselorId
        ? "Asignación actualizada correctamente"
        : "Sesión asignada correctamente"
    );
    setSelectedSession(null);
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
      case "pendiente":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            Pendiente
          </Badge>
        );
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

      {/* Unified Sessions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Sesiones de Apoyo</CardTitle>
          <CardDescription>
            Todas las sesiones con opción de asignar o editar consejero
          </CardDescription>
        </CardHeader>
        <CardContent>
          {supportSessions.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                No hay sesiones registradas
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
                  <TableHead>Consejero Asignado</TableHead>
                  <TableHead>Fecha Solicitud</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {supportSessions.map((session) => (
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
                      {session.assignedCounselorName ? (
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-blue-600" />
                          <span className="text-blue-600 font-medium">
                            {session.assignedCounselorName}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Sin asignar</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(session.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(session.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(session)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Ver Detalles
                        </Button>
                        {session.assignedCounselorId ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleAssignOrEdit(session)
                            }
                            className="text-[#edba0d] border-[#edba0d] hover:bg-yellow-50"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Editar
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() =>
                              handleAssignOrEdit(session)
                            }
                            className="bg-[#004aad] hover:bg-[#003687] text-white"
                          >
                            <UserCheck className="w-3 h-3 mr-1" />
                            Asignar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Assignment/Edit Dialog */}
      <Dialog
        open={!!selectedSession}
        onOpenChange={() => setSelectedSession(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#004aad]" />
              {selectedSession?.assignedCounselorId
                ? "Editar Asignación de Consejero"
                : "Asignar Consejero"}
            </DialogTitle>
            <DialogDescription>
              {selectedSession?.assignedCounselorId
                ? "Modifica la asignación del consejero para esta sesión de apoyo"
                : "Revisa la información del estudiante y asigna el consejero más apropiado"}
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
                {selectedSession.assignedCounselorName && (
                  <div className="mt-2">
                    <span className="text-gray-600">
                      Consejero Actual:
                    </span>
                    <p className="font-medium text-blue-600">
                      {selectedSession.assignedCounselorName}
                    </p>
                  </div>
                )}
              </div>

              {!isAssigning ? (
                <>
                  {/* Counselor Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">
                      {selectedSession.assignedCounselorId
                        ? "Nuevo Consejero Asignado"
                        : "Seleccionar Consejero"}
                    </label>
                    <Select
                      value={assignedCounselor}
                      onValueChange={setAssignedCounselor}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un consejero" />
                      </SelectTrigger>
                      <SelectContent>
                        {personalConsejero.map((counselor) => (
                          <SelectItem
                            key={counselor.per_ID}
                            value={counselor.per_ID}
                          >
                            <div>
                              <p className="font-medium">
                                {counselor.per_Nombres}
                              </p>
                              <p className="text-xs text-gray-500">
                                {counselor.per_Correo}
                              </p>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between pt-4 border-t">
                    {!selectedSession.assignedCounselorId && (
                      <Button
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => setIsAssigning(true)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Rechazar Solicitud
                      </Button>
                    )}
                    <div className="flex gap-3 ml-auto">
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
                        {selectedSession.assignedCounselorId
                          ? "Guardar Cambios"
                          : "Confirmar Asignación"}
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

      {/* View Details Dialog */}
      <Dialog
        open={!!viewSession}
        onOpenChange={() => setViewSession(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#004aad]" />
              Detalles de la Sesión de Apoyo
            </DialogTitle>
            <DialogDescription>
              Información completa de la sesión seleccionada
            </DialogDescription>
          </DialogHeader>

          {viewSession && (
            <div className="space-y-6">
              {/* Student Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-[#004aad] mb-3">
                  Información del Estudiante
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Nombre:</span>
                    <p className="font-medium">{viewSession.studentName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">No. Cuenta:</span>
                    <p className="font-medium">{viewSession.accountNumber}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Nivel de Malestar Emocional:</span>
                    <Badge className={getEmotionalLevelColor(viewSession.emotionalLevel)}>
                      {getEmotionalLevelText(viewSession.emotionalLevel)} ({viewSession.emotionalLevel}/5)
                    </Badge>
                  </div>
                  <div>
                    <span className="text-gray-600">Modalidad Preferida:</span>
                    <p className="font-medium capitalize">{viewSession.modality}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Horario Preferido:</span>
                    <p className="font-medium">{viewSession.preferredTime}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Sesiones Previas:</span>
                    <p className="font-medium">{viewSession.previousSessions ? 'Sí' : 'No'}</p>
                  </div>
                </div>
              </div>

              {/* Session Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Motivo Principal</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {viewSession.mainReason}
                  </p>
                </div>

                {viewSession.additionalComments && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Comentarios Adicionales</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {viewSession.additionalComments}
                    </p>
                  </div>
                )}
              </div>

              {/* Assignment Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Información de Asignación</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Estado:</span>
                    <div className="mt-1">{getStatusBadge(viewSession.status)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Consejero Asignado:</span>
                    <p className="font-medium">
                      {viewSession.assignedCounselorName || 'Sin asignar'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Fecha de Solicitud:</span>
                    <p className="font-medium">{formatDate(viewSession.createdAt)}</p>
                  </div>
                  {viewSession.scheduledAt && (
                    <div>
                      <span className="text-gray-600">Fecha Programada:</span>
                      <p className="font-medium">{formatDate(viewSession.scheduledAt)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t">
                <Button 
                  onClick={() => setViewSession(null)}
                  className="bg-[#004aad] hover:bg-[#003687] text-white"
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
