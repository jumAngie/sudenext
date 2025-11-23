import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Heart, Clock, MessageSquare } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { Student } from "../../types";
import { toast } from "sonner";
import { getLocalDateTime, convertPreferredTimeToTicks } from '../../utils/dateHelpers';

interface SupportSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupportSessionModal({
  isOpen,
  onClose,
}: SupportSessionModalProps) {
  const { user } = useAuth();
  const { addSupportSession } = useData();
  const student = user?.data as Student;

  const [formData, setFormData] = useState({
    mainReason: "",
    emotionalLevel: "",
    previousSessions: "",
    preferredTime: "",
    modality: "",
    additionalComments: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>(
    {},
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.mainReason.trim()) {
      newErrors.mainReason =
        "El motivo principal es obligatorio";
    }
    if (!formData.emotionalLevel) {
      newErrors.emotionalLevel =
        "Debes seleccionar el nivel de malestar";
    }
    if (!formData.previousSessions) {
      newErrors.previousSessions =
        "Debes indicar si has asistido antes";
    }
    if (!formData.preferredTime) {
      newErrors.preferredTime =
        "Debes seleccionar un horario preferido";
    }
    if (!formData.modality) {
      newErrors.modality = "Debes seleccionar la modalidad";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(
        "Por favor completa todos los campos obligatorios",
      );
      return;
    }

    const message = await addSupportSession({
      est_ID: student.id,
      sol_MotivoConsulta: formData.mainReason,
      sol_ResumenSesion: formData.additionalComments || "",
      sol_MalestarEmocional: parseInt(formData.emotionalLevel),
      sol_HorarioPref: formData.preferredTime,
      sol_Asistencia: false,
      sol_Estado: true,
      sol_FechaCreacion: getLocalDateTime(),
    });
    console.log("PAYLOAD ENVIADO:", {
      est_ID: student.id,
      sol_MotivoConsulta: formData.mainReason,
      sol_ResumenSesion: formData.additionalComments || "",
      sol_MalestarEmocional: parseInt(formData.emotionalLevel),
      sol_HorarioPref: formData.preferredTime,
      sol_Asistencia: false,
      sol_Estado: true,
      sol_FechaCreacion: getLocalDateTime(),
    });
    if (!message.toLowerCase().includes("correctamente")) {
      toast.error(message);
      return;
    }

    toast.success(message);

    // Reset form
    setFormData({
      mainReason: "",
      emotionalLevel: "",
      previousSessions: "",
      preferredTime: "",
      modality: "",
      additionalComments: "",
    });

    setErrors({});
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-6xl max-h-[100vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#004aad]">
            <Heart className="w-5 h-5" />
            Solicitud de Sesión de Apoyo Psicológico
          </DialogTitle>
          <DialogDescription>
            Completa este formulario para solicitar una sesión
            de apoyo con nuestros profesionales en psicología.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Info Display */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-[#004aad] mb-2">
              Información del Estudiante
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Nombre:</span>
                <p className="font-medium">{student.name}</p>
              </div>
              <div>
                <span className="text-gray-600">
                  No. Cuenta:
                </span>
                <p className="font-medium">
                  {student.accountNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Main Reason */}
          <div className="space-y-2">
            <Label htmlFor="mainReason" className="after:content-['*'] after:text-red-500 after:ml-1">
              Motivo principal de la consulta
            </Label>
            <Textarea
              id="mainReason"
              placeholder="Describe brevemente el motivo por el cual solicitas la sesión de apoyo..."
              value={formData.mainReason}
              onChange={(e) =>
                handleInputChange("mainReason", e.target.value)
              }
              className={
                errors.mainReason ? "border-red-500" : ""
              }
              rows={4}
            />
            {errors.mainReason && (
              <p className="text-sm text-red-600">
                {errors.mainReason}
              </p>
            )}
          </div>

          {/* Emotional Level */}
          <div className="space-y-3">
            <Label className="after:content-['*'] after:text-red-500 after:ml-1">
              Nivel actual de malestar emocional (1-5)
            </Label>
            <RadioGroup
              value={formData.emotionalLevel}
              onValueChange={(value) =>
                handleInputChange("emotionalLevel", value)
              }
              className="flex flex-wrap gap-4"
            >
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className="flex items-center space-x-2"
                >
                  <RadioGroupItem
                    value={level.toString()}
                    id={`level-${level}`}
                  />
                  <Label
                    htmlFor={`level-${level}`}
                    className="cursor-pointer"
                  >
                    {level}{" "}
                    {level === 1
                      ? "(Bajo)"
                      : level === 5
                        ? "(Alto)"
                        : ""}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {errors.emotionalLevel && (
              <p className="text-sm text-red-600">
                {errors.emotionalLevel}
              </p>
            )}
          </div>

          {/* Previous Sessions */}
          <div className="space-y-3">
            <Label className="after:content-['*'] after:text-red-500 after:ml-1">
              ¿Has asistido antes a sesiones psicológicas?
            </Label>
            <RadioGroup
              value={formData.previousSessions}
              onValueChange={(value) =>
                handleInputChange("previousSessions", value)
              }
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="si" id="previous-si" />
                <Label
                  htmlFor="previous-si"
                  className="cursor-pointer"
                >
                  Sí
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="previous-no" />
                <Label
                  htmlFor="previous-no"
                  className="cursor-pointer"
                >
                  No
                </Label>
              </div>
            </RadioGroup>
            {errors.previousSessions && (
              <p className="text-sm text-red-600">
                {errors.previousSessions}
              </p>
            )}
          </div>

          {/* Preferred Time */}
          <div className="space-y-2">
            <Label
              htmlFor="preferredTime"
              className="after:content-['*'] after:text-red-500 after:ml-1 flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Preferencia de horario para la sesión
            </Label>
            <Select
              value={formData.preferredTime}
              onValueChange={(value) =>
                handleInputChange("preferredTime", value)
              }
            >
              <SelectTrigger
                className={
                  errors.preferredTime ? "border-red-500" : ""
                }
              >
                <SelectValue placeholder="Selecciona un horario" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="07:00">7:00 AM</SelectItem>
                <SelectItem value="08:00">8:00 AM</SelectItem>
                <SelectItem value="09:00">9:00 AM</SelectItem>
                <SelectItem value="10:00">10:00 AM</SelectItem>
                <SelectItem value="11:00">11:00 AM</SelectItem>
                <SelectItem value="13:00">1:00 PM</SelectItem>
                <SelectItem value="14:00">2:00 PM</SelectItem>
                <SelectItem value="15:00">3:00 PM</SelectItem>
                <SelectItem value="16:00">4:00 PM</SelectItem>
              </SelectContent>
            </Select>
            {errors.preferredTime && (
              <p className="text-sm text-red-600">
                {errors.preferredTime}
              </p>
            )}
          </div>

          {/* Modality */}
          <div className="space-y-3">
            <Label className="after:content-['*'] after:text-red-500 after:ml-1">
              ¿Deseas que sea virtual o presencial?
            </Label>
            <RadioGroup
              value={formData.modality}
              onValueChange={(value) =>
                handleInputChange("modality", value)
              }
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="presencial"
                  id="modality-presencial"
                />
                <Label
                  htmlFor="modality-presencial"
                  className="cursor-pointer"
                >
                  Presencial
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="virtual"
                  id="modality-virtual"
                />
                <Label
                  htmlFor="modality-virtual"
                  className="cursor-pointer"
                >
                  Virtual
                </Label>
              </div>
            </RadioGroup>
            {errors.modality && (
              <p className="text-sm text-red-600">
                {errors.modality}
              </p>
            )}
          </div>

          {/* Additional Comments */}
          <div className="space-y-2">
            <Label htmlFor="additionalComments">
              Comentarios adicionales (opcional)
            </Label>
            <Textarea
              id="additionalComments"
              placeholder="Cualquier información adicional que consideres importante..."
              value={formData.additionalComments}
              onChange={(e) =>
                handleInputChange(
                  "additionalComments",
                  e.target.value,
                )
              }
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#004aad] hover:bg-[#003687]"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Enviar Solicitud
            </Button>
          </div>
        </form>


      </DialogContent>
    </Dialog>
  );
}