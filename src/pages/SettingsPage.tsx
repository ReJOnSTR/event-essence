import { useState } from "react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings as SettingsIcon, Bell, User, Shield, Palette, Languages, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { getDefaultLessonDuration, setDefaultLessonDuration } from "@/utils/settings";

const menuItems = [
  {
    title: "Genel",
    icon: SettingsIcon,
    id: "general"
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
  const [selectedSection, setSelectedSection] = useState("general");
  const [defaultDuration, setDefaultDuration] = useState(() => getDefaultLessonDuration());
  const { toast } = useToast();

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setDefaultDuration(value);
      setDefaultLessonDuration(value);
      toast({
        title: "Ayarlar güncellendi",
        description: "Varsayılan ders süresi başarıyla kaydedildi.",
      });
    }
  };

  const renderContent = () => {
    switch (selectedSection) {
      case "general":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Genel Ayarlar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="defaultDuration" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Varsayılan Ders Süresi (dakika)
                </Label>
                <Input
                  id="defaultDuration"
                  type="number"
                  value={defaultDuration}
                  onChange={handleDurationChange}
                  min="1"
                  className="max-w-[200px]"
                />
                <p className="text-sm text-muted-foreground">
                  Yeni ders eklerken otomatik olarak ayarlanacak süre
                </p>
              </div>
            </CardContent>
          </Card>
        );
      case "notifications":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Bildirim Ayarları</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Bildirim ayarları içeriği buraya eklenecek.</p>
            </CardContent>
          </Card>
        );
      case "profile":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Profil Ayarları</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Profil ayarları içeriği buraya eklenecek.</p>
            </CardContent>
          </Card>
        );
      case "security":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Güvenlik Ayarları</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Güvenlik ayarları içeriği buraya eklenecek.</p>
            </CardContent>
          </Card>
        );
      case "appearance":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Görünüm Ayarları</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Görünüm ayarları içeriği buraya eklenecek.</p>
            </CardContent>
          </Card>
        );
      case "language":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Dil Ayarları</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Dil ayarları içeriği buraya eklenecek.</p>
            </CardContent>
          </Card>
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
            <div className="max-w-4xl mx-auto space-y-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}