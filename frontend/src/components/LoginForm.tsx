import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner@2.0.3";
import {
  GraduationCap,
  Users,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import logoUnah from "figma:asset/be64fce97fdf5b7fdbb6109969f91e39af37bc6f.png";
import logoSudecad from "figma:asset/22cd37652b59616ba81f702b45c65f8b7ad8d496.png";

interface LoginFormProps {
  onBackToLanding?: () => void;
}

export function LoginForm({ onBackToLanding }: LoginFormProps) {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    type: "student" as "student" | "staff",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.identifier || !formData.password) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    const success = await login(formData);
    if (!success) {
      toast.error("Credenciales inválidas. Intenta de nuevo.");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTabChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      type: value as "student" | "staff",
      identifier: "",
      password: "",
    }));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Background with Gradient */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Campus universitario"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#004aad]/95 via-[#0056c7]/90 to-[#edba0d]/85"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="max-w-md text-center">
            {/* University Branding */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-4 mb-6">
                <img
                  src={logoUnah}
                  alt="UNAH"
                  className="h-16"
                />
                <div className="border-l border-white/30 h-12"></div>
                <img
                  src={logoSudecad}
                  alt="SUDECAD"
                  className="h-16"
                />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              SUDENEXT
            </h1>

            <p className="text-xl md:text-2xl mb-4 opacity-90">
              Plataforma de Atención Estudiantil
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h2 className="text-lg font-semibold mb-2">
                Universidad Nacional Autónoma de Honduras
              </h2>
              <p className="text-base opacity-90 mb-4">
                Campus Cortés
              </p>
              <p className="text-sm opacity-75">
                Tu bienestar estudiantil es nuestra prioridad
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Header - Only visible on small screens */}
          <div className="lg:hidden mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src={logoUnah} alt="UNAH" className="h-10" />
              <img
                src={logoSudecad}
                alt="SUDECAD"
                className="h-10"
              />
            </div>
            <h1 className="text-2xl font-bold text-[#004aad] mb-2">
              SUDENEXT
            </h1>
            <p className="text-sm text-gray-600">
              UNAH Campus Cortés
            </p>
          </div>

          {/* Back Button */}
          {onBackToLanding && (
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={onBackToLanding}
                className="text-[#004aad] border-[#004aad] hover:bg-[#004aad] hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio
              </Button>
            </div>
          )}

          {/* Login Card */}
          <Card className="shadow-xl border-0 bg-white">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl text-[#004aad] mb-2">
                Iniciar Sesión
              </CardTitle>
              <CardDescription className="text-base">
                Accede a la plataforma de servicios
                estudiantiles
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <Tabs
                value={formData.type}
                onValueChange={handleTabChange}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
                  <TabsTrigger
                    value="student"
                    className="flex items-center gap-2 h-10"
                  >
                    <GraduationCap className="w-4 h-4" />
                    Estudiante
                  </TabsTrigger>
                  <TabsTrigger
                    value="staff"
                    className="flex items-center gap-2 h-10"
                  >
                    <Users className="w-4 h-4" />
                    Personal
                  </TabsTrigger>
                </TabsList>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <TabsContent
                    value="student"
                    className="space-y-6 mt-0"
                  >
                    <div className="space-y-3">
                      <Label
                        htmlFor="student-account"
                        className="text-base font-medium"
                      >
                        Número de Cuenta
                      </Label>
                      <Input
                        id="student-account"
                        type="text"
                        placeholder="Ej: 20191234567"
                        value={formData.identifier}
                        onChange={(e) =>
                          handleInputChange(
                            "identifier",
                            e.target.value,
                          )
                        }
                        className="h-12 text-base"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="student-password"
                        className="text-base font-medium"
                      >
                        Contraseña
                      </Label>
                      <Input
                        id="student-password"
                        type="password"
                        placeholder="Ingresa tu contraseña"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange(
                            "password",
                            e.target.value,
                          )
                        }
                        className="h-12 text-base"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="staff"
                    className="space-y-6 mt-0"
                  >
                    <div className="space-y-3">
                      <Label
                        htmlFor="staff-email"
                        className="text-base font-medium"
                      >
                        Correo Electrónico
                      </Label>
                      <Input
                        id="staff-email"
                        type="email"
                        placeholder="correo@unah.hn"
                        value={formData.identifier}
                        onChange={(e) =>
                          handleInputChange(
                            "identifier",
                            e.target.value,
                          )
                        }
                        className="h-12 text-base"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="staff-password"
                        className="text-base font-medium"
                      >
                        Contraseña
                      </Label>
                      <Input
                        id="staff-password"
                        type="password"
                        placeholder="Ingresa tu contraseña"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange(
                            "password",
                            e.target.value,
                          )
                        }
                        className="h-12 text-base"
                      />
                    </div>
                  </TabsContent>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-[#004aad] hover:bg-[#003687] text-white font-semibold text-base"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Iniciando sesión...
                      </>
                    ) : (
                      "Iniciar Sesión"
                    )}
                  </Button>
                </form>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}