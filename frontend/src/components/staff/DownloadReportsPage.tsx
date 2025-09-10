import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { useData } from '../../context/DataContext';
import { 
  BarChart3, Download, Calendar, FileText, 
  Eye, Printer, Filter, Users, Heart, 
  Stethoscope, BookOpen, TrendingUp, X,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { formatDateTime } from '../../utils/dateHelpers';
import { getStatusColor } from '../../utils/statusHelpers';
import { toast } from 'sonner@2.0.3';

export function DownloadReportsPage() {
  const { supportSessions, dentalAppointments, medicalCheckIns, academicConsultations } = useData();
  
  const [reportType, setReportType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showPreview, setShowPreview] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  // Set default dates to current month
  React.useEffect(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    setStartDate(firstDay.toISOString().split('T')[0]);
    setEndDate(lastDay.toISOString().split('T')[0]);
  }, []);

  const generatePDF = () => {
    if (!reportData || !reportData.rows || reportData.rows.length === 0) {
      toast.error('No hay datos para generar el PDF');
      return;
    }

    // Create a new window for the print dialog
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('No se pudo abrir la ventana de impresión');
      return;
    }

    const reportTitle = getReportTitle();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${reportTitle}</title>
          <meta charset="utf-8">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 20px;
              line-height: 1.6;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 3px solid #004aad;
              padding-bottom: 20px;
            }
            .logo-section {
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 20px;
              margin-bottom: 20px;
            }
            .title {
              color: #004aad;
              font-size: 28px;
              font-weight: bold;
              margin: 10px 0;
            }
            .subtitle {
              color: #666;
              font-size: 16px;
              margin-bottom: 10px;
            }
            .date-range {
              background: #f8f9fa;
              padding: 10px;
              border-radius: 8px;
              margin: 20px 0;
              text-align: center;
              font-weight: 500;
            }
            .summary-stats {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 20px;
              margin: 30px 0;
            }
            .stat-card {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
              border: 1px solid #e9ecef;
            }
            .stat-number {
              font-size: 32px;
              font-weight: bold;
              color: #004aad;
              margin-bottom: 5px;
            }
            .stat-label {
              color: #666;
              font-size: 14px;
            }
            .table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              background: white;
            }
            .table th {
              background: #004aad;
              color: white;
              padding: 12px 8px;
              text-align: left;
              font-weight: 600;
            }
            .table td {
              padding: 10px 8px;
              border-bottom: 1px solid #e9ecef;
            }
            .table tr:nth-child(even) {
              background: #f8f9fa;
            }
            .status-badge {
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: 500;
            }
            .status-pendiente { background: #fff3cd; color: #856404; }
            .status-asignada, .status-confirmada { background: #d1ecf1; color: #0c5460; }
            .status-completada { background: #d4edda; color: #155724; }
            .status-rechazada, .status-cancelada { background: #f8d7da; color: #721c24; }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #666;
              font-size: 12px;
              border-top: 1px solid #e9ecef;
              padding-top: 20px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo-section">
              <h1 style="color: #004aad; margin: 0;">SUDENEXT</h1>
              <span style="color: #666;">|</span>
              <h2 style="color: #edba0d; margin: 0;">SUDECAD</h2>
            </div>
            <div class="title">${reportTitle}</div>
            <div class="subtitle">Universidad Nacional Autónoma de Honduras - Campus Cortés</div>
            <div class="date-range">
              Período: ${new Date(startDate).toLocaleDateString('es-HN')} - ${new Date(endDate).toLocaleDateString('es-HN')}
            </div>
          </div>

          ${reportData.summary ? `
            <div class="summary-stats">
              ${Object.entries(reportData.summary).map(([key, value]: [string, any]) => `
                <div class="stat-card">
                  <div class="stat-number">${value}</div>
                  <div class="stat-label">${key}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <table class="table">
            <thead>
              <tr>
                ${reportData.headers?.map((header: string) => `<th>${header}</th>`).join('') || ''}
              </tr>
            </thead>
            <tbody>
              ${reportData.rows?.map((row: any[]) => `
                <tr>
                  ${row.map((cell, index) => {
                    if (index === row.length - 1 && typeof cell === 'string' && ['pendiente', 'asignada', 'confirmada', 'completada', 'rechazada', 'cancelada'].includes(cell)) {
                      return `<td><span class="status-badge status-${cell}">${cell}</span></td>`;
                    }
                    return `<td>${cell}</td>`;
                  }).join('')}
                </tr>
              `).join('') || ''}
            </tbody>
          </table>

          <div class="footer">
            <p>Reporte generado el ${new Date().toLocaleDateString('es-HN')} a las ${new Date().toLocaleTimeString('es-HN')}</p>
            <p>Sistema SUDENEXT - Servicios Estudiantiles UNAH Campus Cortés</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load, then trigger print dialog
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 1000);

    toast.success('Reporte enviado a impresión/descarga como PDF');
  };

  const downloadExcel = () => {
    if (!reportData.rows || reportData.rows.length === 0) {
      toast.error('No hay datos para exportar');
      return;
    }

    const csvContent = [
      reportData.headers?.join(',') || '',
      ...reportData.rows.map((row: any[]) => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_${reportType}_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Reporte descargado como CSV/Excel');
  };

  const generateReportData = () => {
    if (!reportType || !startDate || !endDate) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include end of day

    let data: any[] = [];
    let headers: string[] = [];
    let summary: any = {};

    try {
      switch (reportType) {
        case 'support-sessions':
          data = supportSessions.filter(session => {
            const sessionDate = new Date(session.createdAt);
            const matchesDate = sessionDate >= start && sessionDate <= end;
            const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
            return matchesDate && matchesStatus;
          });

          headers = ['Estudiante', 'No. Cuenta', 'Motivo Principal', 'Nivel Emocional', 'Modalidad', 'Consejero Asignado', 'Fecha Creación', 'Estado'];
          
          summary = {
            'Total Sesiones': data.length,
            'Pendientes': data.filter(s => s.status === 'pendiente').length,
            'Asignadas': data.filter(s => s.status === 'asignada').length,
            'Completadas': data.filter(s => s.status === 'completada').length
          };

          data = data.map(session => [
            session.studentName || '',
            session.accountNumber || '',
            session.mainReason ? session.mainReason.substring(0, 50) + (session.mainReason.length > 50 ? '...' : '') : '',
            `${session.emotionalLevel || 0}/5`,
            session.modality || '',
            session.assignedCounselorName || 'Sin asignar',
            new Date(session.createdAt).toLocaleDateString('es-HN'),
            session.status || ''
          ]);
          break;

        case 'dental-appointments':
          data = dentalAppointments.filter(appointment => {
            const appointmentDate = new Date(appointment.createdAt);
            const matchesDate = appointmentDate >= start && appointmentDate <= end;
            const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
            return matchesDate && matchesStatus;
          });

          headers = ['Estudiante', 'No. Cuenta', 'Motivo', 'Prioridad', 'Fecha Preferida', 'Odontólogo Asignado', 'Fecha Creación', 'Estado'];
          
          summary = {
            'Total Citas': data.length,
            'Pendientes': data.filter(a => a.status === 'pendiente').length,
            'Confirmadas': data.filter(a => a.status === 'confirmada').length,
            'Completadas': data.filter(a => a.status === 'completada').length
          };

          data = data.map(appointment => [
            appointment.studentName || '',
            appointment.accountNumber || '',
            appointment.reason ? appointment.reason.substring(0, 50) + (appointment.reason.length > 50 ? '...' : '') : '',
            appointment.priority || '',
            appointment.preferredDate || '',
            appointment.assignedDentistName || 'Sin asignar',
            new Date(appointment.createdAt).toLocaleDateString('es-HN'),
            appointment.status || ''
          ]);
          break;

        case 'medical-checkins':
          data = medicalCheckIns.filter(checkin => {
            const checkinDate = new Date(checkin.createdAt);
            return checkinDate >= start && checkinDate <= end;
          });

          headers = ['Estudiante', 'No. Cuenta', 'Síntomas', 'Temperatura', 'Presión Arterial', 'Observaciones', 'Atendido', 'Fecha'];
          
          summary = {
            'Total Check-ins': data.length,
            'Atendidos': data.filter(c => c.attended).length,
            'Pendientes': data.filter(c => !c.attended).length,
            'Con Síntomas': data.filter(c => c.symptoms && c.symptoms.length > 0).length
          };

          data = data.map(checkin => [
            checkin.studentName || '',
            checkin.accountNumber || '',
            checkin.symptoms ? checkin.symptoms.join(', ') : 'Ninguno',
            checkin.temperature ? `${checkin.temperature}°C` : 'No registrado',
            checkin.bloodPressure || 'No registrado',
            checkin.observations ? checkin.observations.substring(0, 40) + (checkin.observations.length > 40 ? '...' : '') : 'Sin observaciones',
            checkin.attended ? 'Sí' : 'No',
            new Date(checkin.createdAt).toLocaleDateString('es-HN')
          ]);
          break;

        case 'academic-consultations':
          data = academicConsultations.filter(consultation => {
            const consultationDate = new Date(consultation.createdAt);
            const matchesDate = consultationDate >= start && consultationDate <= end;
            const matchesStatus = statusFilter === 'all' || consultation.status === statusFilter;
            return matchesDate && matchesStatus;
          });

          headers = ['Estudiante', 'No. Cuenta', 'Tipo Consulta', 'Descripción', 'Asesor', 'Seguimiento', 'Fecha', 'Estado'];
          
          summary = {
            'Total Consultas': data.length,
            'Completadas': data.filter(c => c.status === 'completada').length,
            'Requieren Seguimiento': data.filter(c => c.followUpRequired).length,
            'Este Mes': data.filter(c => {
              const date = new Date(c.createdAt);
              const now = new Date();
              return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            }).length
          };

          data = data.map(consultation => [
            consultation.studentName || '',
            consultation.accountNumber || '',
            consultation.consultationType || '',
            consultation.description ? consultation.description.substring(0, 50) + (consultation.description.length > 50 ? '...' : '') : '',
            consultation.advisorName || '',
            consultation.followUpRequired ? 'Requerido' : 'No requerido',
            new Date(consultation.createdAt).toLocaleDateString('es-HN'),
            consultation.status || ''
          ]);
          break;

        default:
          toast.error('Tipo de reporte no válido');
          return;
      }

      if (data.length === 0) {
        toast.error('No se encontraron datos para el período y filtros seleccionados');
        return;
      }

      setReportData({
        headers,
        rows: data,
        summary
      });
      setShowPreview(true);
      toast.success(`Reporte generado con ${data.length} registros`);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Error al generar el reporte. Por favor intenta de nuevo.');
    }
  };

  const getStatusOptions = () => {
    switch (reportType) {
      case 'support-sessions':
        return [
          { value: 'all', label: 'Todos los estados' },
          { value: 'pendiente', label: 'Pendiente' },
          { value: 'asignada', label: 'Asignada' },
          { value: 'completada', label: 'Completada' },
          { value: 'rechazada', label: 'Rechazada' }
        ];
      case 'dental-appointments':
        return [
          { value: 'all', label: 'Todos los estados' },
          { value: 'pendiente', label: 'Pendiente' },
          { value: 'confirmada', label: 'Confirmada' },
          { value: 'completada', label: 'Completada' },
          { value: 'cancelada', label: 'Cancelada' }
        ];
      case 'academic-consultations':
        return [
          { value: 'all', label: 'Todos los estados' },
          { value: 'pendiente', label: 'Pendiente' },
          { value: 'completada', label: 'Completada' }
        ];
      default:
        return [{ value: 'all', label: 'Todos los estados' }];
    }
  };

  const getReportTitle = () => {
    switch (reportType) {
      case 'support-sessions':
        return 'Reporte de Sesiones de Apoyo';
      case 'dental-appointments':
        return 'Reporte de Citas Odontológicas';
      case 'medical-checkins':
        return 'Reporte de Check-ins Médicos';
      case 'academic-consultations':
        return 'Reporte de Consultas Académicas';
      default:
        return 'Reporte General';
    }
  };

  const clearReport = () => {
    setShowPreview(false);
    setReportData(null);
    setReportType('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-[#004aad]">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2 text-[#004aad]">
                <BarChart3 className="w-5 h-5" />
                Generar Reportes del Sistema
              </CardTitle>
              <CardDescription>
                Genera reportes detallados de los servicios estudiantiles con previsualización y descarga en PDF/Excel
              </CardDescription>
            </div>
            {showPreview && (
              <Button
                variant="outline"
                onClick={clearReport}
                className="text-gray-600 border-gray-200 hover:bg-gray-50"
              >
                <X className="w-4 h-4 mr-2" />
                Nuevo Reporte
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      <div className={`grid transition-all duration-300 ${showPreview ? 'grid-cols-1 xl:grid-cols-3 gap-6' : 'grid-cols-1'}`}>
        {/* Configuration Panel */}
        <div className={`space-y-6 ${showPreview ? 'xl:col-span-1' : ''}`}>
          {/* Report Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Configuración del Reporte
              </CardTitle>
              <CardDescription>
                Selecciona el tipo de reporte y configura los filtros
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Report Type Selection */}
              <div className="grid grid-cols-1 gap-3">
                <Label>Tipo de Reporte</Label>
                <div className="grid grid-cols-1 gap-3">
                  <Card 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      reportType === 'support-sessions' ? 'ring-2 ring-[#004aad] bg-blue-50' : ''
                    }`}
                    onClick={() => setReportType('support-sessions')}
                  >
                    <CardContent className="p-3 flex items-center gap-3">
                      <Heart className="w-6 h-6 text-red-600 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">Sesiones de Apoyo</h3>
                        <p className="text-xs text-gray-600">{supportSessions.length} registros</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      reportType === 'dental-appointments' ? 'ring-2 ring-[#004aad] bg-blue-50' : ''
                    }`}
                    onClick={() => setReportType('dental-appointments')}
                  >
                    <CardContent className="p-3 flex items-center gap-3">
                      <Stethoscope className="w-6 h-6 text-[#edba0d] flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">Citas Odontológicas</h3>
                        <p className="text-xs text-gray-600">{dentalAppointments.length} registros</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      reportType === 'medical-checkins' ? 'ring-2 ring-[#004aad] bg-blue-50' : ''
                    }`}
                    onClick={() => setReportType('medical-checkins')}
                  >
                    <CardContent className="p-3 flex items-center gap-3">
                      <Users className="w-6 h-6 text-green-600 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">Check-ins Médicos</h3>
                        <p className="text-xs text-gray-600">{medicalCheckIns.length} registros</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      reportType === 'academic-consultations' ? 'ring-2 ring-[#004aad] bg-blue-50' : ''
                    }`}
                    onClick={() => setReportType('academic-consultations')}
                  >
                    <CardContent className="p-3 flex items-center gap-3">
                      <BookOpen className="w-6 h-6 text-purple-600 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">Consultas Académicas</h3>
                        <p className="text-xs text-gray-600">{academicConsultations.length} registros</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              {/* Filters */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Fecha de Inicio</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Fecha de Fin</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {getStatusOptions().map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={generateReportData}
                disabled={!reportType || !startDate || !endDate}
                className="w-full bg-[#004aad] hover:bg-[#003687] text-white"
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? 'Actualizar Reporte' : 'Generar Reporte'}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          {!showPreview && (
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Servicios</CardTitle>
                  <TrendingUp className="h-4 w-4 text-[#004aad]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {supportSessions.length + dentalAppointments.length + medicalCheckIns.length + academicConsultations.length}
                  </div>
                  <p className="text-xs text-muted-foreground">Registros en el sistema</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sesiones de Apoyo</CardTitle>
                  <Heart className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{supportSessions.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {supportSessions.filter(s => s.status === 'pendiente').length} pendientes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Citas Odontológicas</CardTitle>
                  <Stethoscope className="h-4 w-4 text-[#edba0d]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dentalAppointments.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {dentalAppointments.filter(a => a.status === 'pendiente').length} pendientes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Check-ins Médicos</CardTitle>
                  <Users className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{medicalCheckIns.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {medicalCheckIns.filter(c => c.attended).length} atendidos
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Report Preview Section */}
        {showPreview && reportData && (
          <div className="xl:col-span-2 space-y-6">
            {/* Preview Header */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-[#004aad]" />
                      Vista Previa del Reporte
                    </CardTitle>
                    <CardDescription>
                      {getReportTitle()} • {reportData.rows?.length || 0} registros encontrados
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={downloadExcel}
                      disabled={!reportData.rows || reportData.rows.length === 0}
                      className="text-green-600 border-green-200 hover:bg-green-50"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Excel
                    </Button>
                    <Button 
                      onClick={generatePDF}
                      disabled={!reportData.rows || reportData.rows.length === 0}
                      className="bg-[#004aad] hover:bg-[#003687] text-white"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Report Content */}
            <Card>
              <CardContent className="p-6">
                {/* Report Header */}
                <div className="text-center border-b pb-6 mb-6">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <h2 className="text-2xl font-bold text-[#004aad]">SUDENEXT</h2>
                    <span className="text-gray-400">|</span>
                    <h3 className="text-xl font-semibold text-[#edba0d]">SUDECAD</h3>
                  </div>
                  <h1 className="text-xl font-semibold text-gray-900 mb-2">
                    {getReportTitle()}
                  </h1>
                  <p className="text-sm text-gray-600 mb-3">Universidad Nacional Autónoma de Honduras - Campus Cortés</p>
                  <div className="bg-blue-50 px-4 py-2 rounded-lg inline-block">
                    <span className="text-sm font-medium text-blue-800">
                      Período: {new Date(startDate).toLocaleDateString('es-HN')} - {new Date(endDate).toLocaleDateString('es-HN')}
                    </span>
                  </div>
                </div>

                {/* Summary Statistics */}
                {reportData.summary && Object.keys(reportData.summary).length > 0 && (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {Object.entries(reportData.summary).map(([key, value]: [string, any]) => (
                      <div key={key} className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-[#004aad] mb-1">{value}</div>
                        <div className="text-sm text-gray-600">{key}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Data Table */}
                {reportData.headers && reportData.rows && reportData.rows.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-[#004aad] text-white">
                          <tr>
                            {reportData.headers.map((header: string, index: number) => (
                              <th key={index} className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="max-h-96 overflow-y-auto">
                          {reportData.rows.map((row: any[], rowIndex: number) => (
                            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="px-4 py-3 text-sm whitespace-nowrap">
                                  {cellIndex === row.length - 1 && typeof cell === 'string' && 
                                   ['pendiente', 'asignada', 'confirmada', 'completada', 'rechazada', 'cancelada'].includes(cell) ? (
                                    <Badge className={getStatusColor(cell)}>
                                      {cell}
                                    </Badge>
                                  ) : (
                                    String(cell)
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No hay datos disponibles para mostrar</p>
                    <p className="text-gray-400 text-sm">Verifica los filtros y el rango de fechas seleccionado</p>
                  </div>
                )}

                {/* Footer */}
                <div className="text-center text-sm text-gray-500 mt-6 pt-6 border-t">
                  <p>Reporte generado el {new Date().toLocaleDateString('es-HN')} a las {new Date().toLocaleTimeString('es-HN')}</p>
                  <p>Sistema SUDENEXT - Servicios Estudiantiles UNAH Campus Cortés</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}