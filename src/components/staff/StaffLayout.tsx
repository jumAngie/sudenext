import React, { useState } from "react";
import { Button } from "../ui/button";
import { useAuth } from "../../context/AuthContext";
import { StaffMember, UserRole } from "../../types";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Stethoscope,
  UserCheck,
  BookOpen,
  Heart,
  Settings,
  LogOut,
  Menu,
  X,
  Download,
  UserPlus,
  BarChart3,
  ChevronDown,
  ChevronRight,
  List,
  Eye,
  Activity
} from "lucide-react";
import logoUnah from "figma:asset/be64fce97fdf5b7fdbb6109969f91e39af37bc6f.png";
import logoSudenext from "figma:asset/fbac00c7ee6746f5326012d41ba2b03e7a9e7f11.png";
import logoSudecad from "figma:asset/22cd37652b59616ba81f702b45c65f8b7ad8d496.png";

interface StaffLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

interface MenuItemBase {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

interface SingleMenuItem extends MenuItemBase {
  type: 'single';
}

interface GroupMenuItem {
  type: 'group';
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
  items: MenuItemBase[];
}

type MenuItem = SingleMenuItem | GroupMenuItem;

const menuItems: MenuItem[] = [
  // Dashboard - Always visible for all roles
  {
    type: 'single',
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
    roles: [
      "administrador",
      "odontologo",
      "medico_general",
      "asesor_academico",
      "consejero",
    ],
  },

  // Psychology Module - Admin and Counselor
  {
    type: 'group',
    id: "psychology",
    label: "Psicología",
    icon: <Heart className="w-4 h-4" />,
    roles: ["administrador", "consejero"],
    items: [
      {
        id: "support-sessions-list",
        label: "Listado de Sesiones de Apoyo",
        icon: <List className="w-4 h-4" />,
        roles: ["administrador"]
      },
      {
        id: "assign-counselor",
        label: "Asignar Consejero",
        icon: <UserCheck className="w-4 h-4" />,
        roles: ["administrador"]
      },
      {
        id: "action-plans",
        label: "Planes de Acción",
        icon: <FileText className="w-4 h-4" />,
        roles: ["consejero"]
      }
    ]
  },

  // Dentistry Module - Admin and Dentist
  {
    type: 'group',
    id: "dentistry",
    label: "Odontología",
    icon: <Stethoscope className="w-4 h-4" />,
    roles: ["administrador", "odontologo"],
    items: [
      {
        id: "dental-appointments-list",
        label: "Listado de Citas Odontológicas",
        icon: <List className="w-4 h-4" />,
        roles: ["administrador"]
      },
      {
        id: "dental-treatment",
        label: "Registrar Tratamiento",
        icon: <FileText className="w-4 h-4" />,
        roles: ["odontologo"]
      },
      {
        id: "assign-dental",
        label: "Asignar Odontólogo",
        icon: <UserPlus className="w-4 h-4" />,
        roles: ["administrador"]
      }
    ]
  },

  // General Medicine Module - Admin and Doctor
  {
    type: 'group',
    id: "medicine",
    label: "Medicina General",
    icon: <Activity className="w-4 h-4" />,
    roles: ["administrador", "medico_general"],
    items: [
      {
        id: "medical-checkins-list",
        label: "Listado de Check-ins Médicos",
        icon: <List className="w-4 h-4" />,
        roles: ["administrador"]
      },
      {
        id: "medical-checkin",
        label: "Atención Médica",
        icon: <Users className="w-4 h-4" />,
        roles: ["medico_general"]
      }
    ]
  },

  // Academic Consultations Module - Admin and Academic Advisor
  {
    type: 'group',
    id: "academic",
    label: "Consultas Académicas",
    icon: <BookOpen className="w-4 h-4" />,
    roles: ["administrador", "asesor_academico"],
    items: [
      {
        id: "academic-consultations-list",
        label: "Listado de Consultas Académicas",
        icon: <List className="w-4 h-4" />,
        roles: ["administrador"]
      },
      {
        id: "academic-consultations",
        label: "Gestión de Consultas",
        icon: <FileText className="w-4 h-4" />,
        roles: ["asesor_academico"]
      }
    ]
  },

  // Reports - Admin only
  {
    type: 'single',
    id: "download-reports",
    label: "Generar Reportes",
    icon: <BarChart3 className="w-4 h-4" />,
    roles: ["administrador"],
  }
];

export function StaffLayout({
  children,
  currentPage,
  onPageChange,
}: StaffLayoutProps) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['psychology', 'dentistry', 'medicine', 'academic']);
  const staff = user?.data as StaffMember;

  // Filter menu items based on user role
  const availableMenuItems = menuItems.filter((item) => {
    if (item.type === 'single') {
      return item.roles.includes(staff.role);
    } else {
      // For groups, check if user has access to any item in the group
      const hasAccessToAnyItem = item.items.some(subItem => subItem.roles.includes(staff.role));
      return item.roles.includes(staff.role) && hasAccessToAnyItem;
    }
  });

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleMenuClick = (pageId: string) => {
    onPageChange(pageId);
    setSidebarOpen(false);
  };

  const getRoleDisplay = (role: UserRole) => {
    const roleNames = {
      administrador: "Administrador",
      odontologo: "Odontólogo",
      medico_general: "Médico General",
      asesor_academico: "Asesor Académico",
      consejero: "Consejero/Psicólogo",
    };
    return roleNames[role];
  };

  const getPageTitle = (pageId: string) => {
    // Check single items first
    const singleItem = menuItems.find(item => item.type === 'single' && item.id === pageId);
    if (singleItem) return singleItem.label;

    // Check group items
    for (const item of menuItems) {
      if (item.type === 'group') {
        const subItem = item.items.find(subItem => subItem.id === pageId);
        if (subItem) return subItem.label;
      }
    }
    
    return "Dashboard";
  };

  // Check if a page is in the current group
  const isCurrentPageInGroup = (groupItem: GroupMenuItem) => {
    return groupItem.items.some(item => item.id === currentPage);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={logoSudenext}
                alt="SUDENEXT"
                className="h-8"
              />
              <div>
                <h2 className="text-lg font-bold text-[#004aad]">
                  SUDENEXT
                </h2>
                <p className="text-xs text-gray-600">
                  Personal - SUDECAD
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200 bg-[#004aad] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#004aad] font-medium">
                {staff.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {staff.name}
              </p>
              <p className="text-xs opacity-90">
                {getRoleDisplay(staff.role)}
              </p>
              <p className="text-xs opacity-75 truncate">
                {staff.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {availableMenuItems.map((item) => (
              <li key={item.id}>
                {item.type === 'single' ? (
                  // Single menu item
                  <Button
                    variant={currentPage === item.id ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      currentPage === item.id
                        ? "bg-[#004aad] text-white hover:bg-[#003687]"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                    onClick={() => handleMenuClick(item.id)}
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </Button>
                ) : (
                  // Group menu item
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${
                        isCurrentPageInGroup(item) ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => toggleGroup(item.id)}
                    >
                      {item.icon}
                      <span className="ml-2 flex-1 text-left">{item.label}</span>
                      {expandedGroups.includes(item.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </Button>
                    
                    {expandedGroups.includes(item.id) && (
                      <div className="ml-6 space-y-1">
                        {item.items
                          .filter(subItem => subItem.roles.includes(staff.role))
                          .map((subItem) => (
                          <Button
                            key={subItem.id}
                            variant={currentPage === subItem.id ? "default" : "ghost"}
                            size="sm"
                            className={`w-full justify-start text-sm ${
                              currentPage === subItem.id
                                ? "bg-[#004aad] text-white hover:bg-[#003687]"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            }`}
                            onClick={() => handleMenuClick(subItem.id)}
                          >
                            {subItem.icon}
                            <span className="ml-2">{subItem.label}</span>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="outline"
            className="w-full justify-start text-red-600 border-red-200"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-3">
                <img
                  src={logoUnah}
                  alt="UNAH"
                  className="h-8"
                />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {getPageTitle(currentPage)}
                  </h1>
                  <p className="text-sm text-gray-600">
                    Universidad Nacional Autónoma de Honduras -
                    Campus Cortés
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {staff.department}
              </p>
              <p className="text-xs text-gray-600">
                {getRoleDisplay(staff.role)}
              </p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}