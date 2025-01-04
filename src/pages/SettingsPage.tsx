import { PageHeader } from "@/components/Layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import GeneralSettings from "@/components/Settings/GeneralSettings";
import WorkingHoursSettings from "@/components/Settings/WorkingHoursSettings";
import CustomHolidaySettings from "@/components/Settings/CustomHolidaySettings";
import DataManagement from "@/components/Settings/DataManagement";
import ThemeSettings from "@/components/Settings/ThemeSettings";

export default function SettingsPage() {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center gap-2 md:gap-4 p-2 md:p-4 border-b bg-background">
        <SidebarTrigger />
        <h1 className="text-lg md:text-2xl font-semibold text-foreground truncate">
          Ayarlar
        </h1>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="w-full justify-start mb-4">
              <TabsTrigger value="general">Genel</TabsTrigger>
              <TabsTrigger value="working-hours">Çalışma Saatleri</TabsTrigger>
              <TabsTrigger value="custom-holidays">Tatil Günleri</TabsTrigger>
              <TabsTrigger value="theme">Tema</TabsTrigger>
              <TabsTrigger value="data">Veri Yönetimi</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <GeneralSettings />
            </TabsContent>
            <TabsContent value="working-hours">
              <WorkingHoursSettings />
            </TabsContent>
            <TabsContent value="custom-holidays">
              <CustomHolidaySettings />
            </TabsContent>
            <TabsContent value="theme">
              <ThemeSettings />
            </TabsContent>
            <TabsContent value="data">
              <DataManagement />
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}
