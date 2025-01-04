import { PageHeader } from "@/components/Layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider, Sidebar, SidebarContent } from "@/components/ui/sidebar";
import GeneralSettings from "@/components/Settings/GeneralSettings";
import WorkingHoursSettings from "@/components/Settings/WorkingHoursSettings";
import HolidaySettings from "@/components/Settings/HolidaySettings";
import DataManagement from "@/components/Settings/DataManagement";
import ThemeSettings from "@/components/Settings/ThemeSettings";
import SideMenu from "@/components/Layout/SideMenu";

export default function SettingsPage() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar>
          <SidebarContent className="p-4">
            <SideMenu />
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col">
          <PageHeader
            title="Ayarlar"
            backTo="/"
            backLabel="Takvime Dön"
          />

          <div className="p-4">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="general">Genel</TabsTrigger>
                <TabsTrigger value="working-hours">Çalışma Saatleri</TabsTrigger>
                <TabsTrigger value="holidays">Tatil Günleri</TabsTrigger>
                <TabsTrigger value="theme">Tema</TabsTrigger>
                <TabsTrigger value="data">Veri Yönetimi</TabsTrigger>
              </TabsList>
              <TabsContent value="general">
                <GeneralSettings />
              </TabsContent>
              <TabsContent value="working-hours">
                <WorkingHoursSettings />
              </TabsContent>
              <TabsContent value="holidays">
                <HolidaySettings />
              </TabsContent>
              <TabsContent value="theme">
                <ThemeSettings />
              </TabsContent>
              <TabsContent value="data">
                <DataManagement />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}