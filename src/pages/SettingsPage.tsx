import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Clock, Palette, Upload } from "lucide-react";
import { PageHeader } from "@/components/Layout/PageHeader";
import GeneralSettings from "@/components/Settings/GeneralSettings";
import WorkingHoursSettings from "@/components/Settings/WorkingHoursSettings";
import ThemeSettings from "@/components/Settings/ThemeSettings";
import DataManagement from "@/components/Settings/DataManagement";
import CustomHolidaySettings from "@/components/Settings/CustomHolidaySettings";
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

          <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-6 overflow-y-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <div className="sticky top-0 z-10 bg-gray-50 pb-4">
                <TabsList className="bg-white border h-auto min-h-[48px] w-full justify-start gap-2 p-1 flex-wrap">
                  <TabsTrigger value="general" className="gap-2 data-[state=active]:bg-gray-100">
                    <SettingsIcon className="h-4 w-4 hidden sm:block" />
                    <span>Genel</span>
                  </TabsTrigger>
                  <TabsTrigger value="working-hours" className="gap-2 data-[state=active]:bg-gray-100">
                    <Clock className="h-4 w-4 hidden sm:block" />
                    <span>Çalışma Saatleri</span>
                  </TabsTrigger>
                  <TabsTrigger value="appearance" className="gap-2 data-[state=active]:bg-gray-100">
                    <Palette className="h-4 w-4 hidden sm:block" />
                    <span>Görünüm</span>
                  </TabsTrigger>
                  <TabsTrigger value="data" className="gap-2 data-[state=active]:bg-gray-100">
                    <Upload className="h-4 w-4 hidden sm:block" />
                    <span>Veri Yönetimi</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="space-y-6">
                <TabsContent value="general" className="space-y-6 mt-0">
                  <div className="grid gap-6">
                    <GeneralSettings />
                    <CustomHolidaySettings />
                  </div>
                </TabsContent>
                
                <TabsContent value="working-hours" className="mt-0">
                  <WorkingHoursSettings />
                </TabsContent>
                
                <TabsContent value="appearance" className="mt-0">
                  <ThemeSettings />
                </TabsContent>

                <TabsContent value="data" className="mt-0">
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