import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Clock, Palette, Upload } from "lucide-react";
import { PageHeader } from "@/components/Layout/PageHeader";
import GeneralSettings from "@/components/Settings/GeneralSettings";
import WorkingHoursSettings from "@/components/Settings/WorkingHoursSettings";
import ThemeSettings from "@/components/Settings/ThemeSettings";
import DataManagement from "@/components/Settings/DataManagement";
import SideMenu from "@/components/Layout/SideMenu";
import { SidebarProvider, Sidebar, SidebarContent } from "@/components/ui/sidebar";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gray-50 font-sans">
        <Sidebar>
          <SidebarContent className="p-4">
            <SideMenu />
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <PageHeader 
            title="Ayarlar"
            backTo="/"
            backLabel="Takvime Dön"
          />

          <div className="container py-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="bg-white border h-12 w-full justify-start gap-2 p-1">
                <TabsTrigger value="general" className="gap-2 data-[state=active]:bg-gray-100">
                  <SettingsIcon className="h-4 w-4" />
                  <span>Genel</span>
                </TabsTrigger>
                <TabsTrigger value="working-hours" className="gap-2 data-[state=active]:bg-gray-100">
                  <Clock className="h-4 w-4" />
                  <span>Çalışma Saatleri</span>
                </TabsTrigger>
                <TabsTrigger value="appearance" className="gap-2 data-[state=active]:bg-gray-100">
                  <Palette className="h-4 w-4" />
                  <span>Görünüm</span>
                </TabsTrigger>
                <TabsTrigger value="data" className="gap-2 data-[state=active]:bg-gray-100">
                  <Upload className="h-4 w-4" />
                  <span>Veri Yönetimi</span>
                </TabsTrigger>
              </TabsList>

              <div className="space-y-6">
                <TabsContent value="general">
                  <GeneralSettings />
                </TabsContent>
                
                <TabsContent value="working-hours">
                  <WorkingHoursSettings />
                </TabsContent>
                
                <TabsContent value="appearance">
                  <ThemeSettings />
                </TabsContent>

                <TabsContent value="data">
                  <DataManagement />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}