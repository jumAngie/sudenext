import React from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Heart,
  Stethoscope,
  BookOpen,
  Users,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoUnah from "figma:asset/be64fce97fdf5b7fdbb6109969f91e39af37bc6f.png";
import logoSudecad from "figma:asset/22cd37652b59616ba81f702b45c65f8b7ad8d496.png";

interface LandingPageProps {
  onLoginClick: () => void;
}

export function LandingPage({ onLoginClick }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Estudiantes universitarios"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#004aad]/90 via-[#0056c7]/85 to-[#edba0d]/80"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8">
              Plataforma de Atención Estudiantil
            </h1>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 max-w-3xl mx-auto border border-white/20">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                Universidad Nacional Autónoma de Honduras
              </h2>
              <p className="text-xl md:text-2xl opacity-90 mb-6">
                Campus Cortés
              </p>
              <p className="text-base md:text-lg opacity-80 mb-8">
                Tu bienestar estudiantil es nuestra prioridad
              </p>
              
              <Button
                onClick={onLoginClick}
                size="lg"
                className="bg-[#edba0d] hover:bg-[#d4a40b] text-white font-semibold px-8 py-4 text-lg rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                Ingresar al Sistema
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Servicios Disponibles
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              SUDENEXT ofrece servicios integrales de atención estudiantil para
              apoyar tu bienestar físico, mental y académico durante tu
              trayectoria universitaria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Apoyo Psicológico */}
            <Card className="text-center hover:shadow-lg transition-shadow duration-300 border-2 hover:border-[#004aad]/20">
              <CardHeader>
                <div className="w-16 h-16 bg-[#004aad]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-[#004aad]" />
                </div>
                <CardTitle className="text-xl font-semibold text-[#004aad]">
                  Apoyo Psicológico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Sesiones de apoyo emocional y psicológico para manejar el
                  estrés académico y personal. Nuestros psicólogos te brindan
                  herramientas para tu bienestar mental.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Atención Médica */}
            <Card className="text-center hover:shadow-lg transition-shadow duration-300 border-2 hover:border-[#004aad]/20">
              <CardHeader>
                <div className="w-16 h-16 bg-[#edba0d]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="h-8 w-8 text-[#edba0d]" />
                </div>
                <CardTitle className="text-xl font-semibold text-[#004aad]">
                  Atención Médica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Servicios de medicina general y odontología para mantener tu
                  salud física. Check-ups regulares y tratamientos
                  especializados.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Asesoría Académica */}
            <Card className="text-center hover:shadow-lg transition-shadow duration-300 border-2 hover:border-[#004aad]/20">
              <CardHeader>
                <div className="w-16 h-16 bg-[#004aad]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-[#004aad]" />
                </div>
                <CardTitle className="text-xl font-semibold text-[#004aad]">
                  Asesoría Académica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Orientación académica personalizada para planificar tu
                  trayectoria universitaria, cambios de carrera y resolución de
                  dudas académicas.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Gestión Integral */}
            <Card className="text-center hover:shadow-lg transition-shadow duration-300 border-2 hover:border-[#004aad]/20">
              <CardHeader>
                <div className="w-16 h-16 bg-[#edba0d]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-[#edba0d]" />
                </div>
                <CardTitle className="text-xl font-semibold text-[#004aad]">
                  Gestión Integral
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Sistema unificado para gestionar todos tus servicios
                  estudiantiles desde una sola plataforma. Seguimiento
                  personalizado de tu bienestar.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                ¿Por qué elegir SUDENEXT?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#004aad] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      Atención Personalizada
                    </h3>
                    <p className="text-gray-600">
                      Cada estudiante recibe atención individualizada según sus
                      necesidades específicas de bienestar y desarrollo
                      académico.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#edba0d] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      Profesionales Calificados
                    </h3>
                    <p className="text-gray-600">
                      Nuestro equipo está conformado por psicólogos, médicos,
                      odontólogos y asesores académicos altamente calificados.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#004aad] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      Tecnología Integrada
                    </h3>
                    <p className="text-gray-600">
                      Plataforma digital que te permite gestionar citas,
                      consultas y seguimiento de servicios de manera eficiente
                      y segura.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-[#004aad]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-[#004aad]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Acceso Fácil y Rápido
                </h3>
                <p className="text-gray-600">
                  Inicia sesión con tu número de cuenta estudiantil y accede a
                  todos los servicios desde cualquier dispositivo.
                </p>
              </div>

              <Button
                onClick={onLoginClick}
                className="w-full bg-[#004aad] hover:bg-[#003687] text-white font-semibold py-3 rounded-lg transition-colors duration-300"
                size="lg"
              >
                Comenzar Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#004aad] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo and Description */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={logoUnah}
                  alt="UNAH"
                  className="h-12"
                />
                <div>
                  <h3 className="font-bold text-lg">SUDENEXT</h3>
                  <p className="text-sm opacity-80">SUDECAD</p>
                </div>
              </div>
              <p className="text-sm opacity-90 mb-4">
                Plataforma integral de atención estudiantil de la Universidad
                Nacional Autónoma de Honduras, Campus Cortés.
              </p>
              <img
                src={logoSudecad}
                alt="SUDECAD"
                className="h-16"
              />
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Servicios</h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li>Apoyo Psicológico</li>
                <li>Atención Médica</li>
                <li>Servicios Odontológicos</li>
                <li>Asesoría Académica</li>
                <li>Planes de Acción</li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Contacto</h4>
              <div className="space-y-3 text-sm opacity-90">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Campus Cortés, UNAH</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+504 2216-3000</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>sudecad@unah.edu.hn</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <p className="text-sm opacity-80">
              © 2024 Universidad Nacional Autónoma de Honduras - Campus Cortés.
              Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}