import { useState, useEffect } from "react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings as SettingsIcon, Bell, User, Shield, Palette, Languages, Calendar } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import GeneralSettings from "@/components/Settings/GeneralSettings";
import WorkingHoursSettings from "@/components/Settings/WorkingHoursSettings";
import HolidaySettings from "@/components/Settings/HolidaySettings";

const menuItems = [
  {
    title: "Genel",
    icon: SettingsIcon,
    id: "general"
  },
  {
    title: "Çalışma Saatleri",
    icon: Calendar,
    id: "working-hours"
  },
  {
    title: "Bildirimler",
    icon: Bell,
    id: "notifications"
  },
  {
    title: "Profil",
    icon: User,
    id: "profile"
  },
  {
    title: "Güvenlik",
    icon: Shield,
    id: "security"
  },
  {
    title: "Görünüm",
    icon: Palette,
    id: "appearance"
  },
  {
    title: "Dil",
    icon: Languages,
    id: "language"
  }
];

export default function Settings() {
  const [selectedSection, setSelectedSection] = useState(() => {
    return localStorage.getItem('settingsSection') || "general";
  });
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('settingsSection', selectedSection);
  }, [selectedSection]);

  const renderContent = () => {
    switch (selectedSection) {
      case "general":
        return (
          <div className="space-y-6">
            <GeneralSettings />
          </div>
        );
      case "working-hours":
        return (
          <div className="space-y-6">
            <WorkingHoursSettings />
            <HolidaySettings />
          </div>
        );
      case "notifications":
        return (
          <div className="text-gray-600">Bildirim ayarları içeriği buraya eklenecek.</div>
        );
      case "profile":
        return (
          <div className="text-gray-600">Profil ayarları içeriği buraya eklenecek.</div>
        );
      case "security":
        return (
          <div className="text-gray-600">Güvenlik ayarları içeriği buraya eklenecek.</div>
        );
      case "appearance":
        return (
          <div className="text-gray-600">Görünüm ayarları içeriği buraya eklenecek.</div>
        );
      case "language":
        return (
          <div className="text-gray-600">Dil ayarları içeriği buraya eklenecek.</div>
        );
      default:
        return null;
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gray-50 font-sans">
        <Sidebar>
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel>Ayarlar</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setSelectedSection(item.id)}
                        isActive={selectedSection === item.id}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <div className="flex items-center gap-4 p-4 border-b bg-white">
            <SidebarTrigger />
            <Link 
              to="/" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Takvime Dön</span>
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900">Ayarlar</h1>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            <div className="max-w-4xl mx-auto">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}