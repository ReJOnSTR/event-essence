import { PageHeader } from "@/components/Layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import GeneralSettings from "@/components/Settings/GeneralSettings";
import WorkingHoursSettings from "@/components/Settings/WorkingHoursSettings";
import CustomHolidaySettings from "@/components/Settings/CustomHolidaySettings";
import DataManagement from "@/components/Settings/DataManagement";
import ThemeSettings from "@/components/Settings/ThemeSettings";
import RecurringLessonsSettings from "@/components/Settings/RecurringLessonsSettings";

export default function SettingsPage() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        title="Ayarlar"
        backTo="/"
        backLabel="Takvime Dön"
      />

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Tabs defaultValue="general" className="w-full space-y-6">
            <TabsList className="w-full justify-start mb-4 flex-wrap gap-2 h-auto p-1">
              <TabsTrigger value="general" className="h-8">Genel</TabsTrigger>
              <TabsTrigger value="working-hours" className="h-8">Çalışma Saatleri</TabsTrigger>
              <TabsTrigger value="custom-holidays" className="h-8">Tatil Günleri</TabsTrigger>
              <TabsTrigger value="recurring-lessons" className="h-8">Tekrarlanan Dersler</TabsTrigger>
              <TabsTrigger value="theme" className="h-8">Tema</TabsTrigger>
              <TabsTrigger value="data" className="h-8">Veri Yönetimi</TabsTrigger>
            </TabsList>
            <div className="space-y-6">
              <TabsContent value="general" className="m-0">
                <GeneralSettings />
              </TabsContent>
              <TabsContent value="working-hours" className="m-0">
                <WorkingHoursSettings />
              </TabsContent>
              <TabsContent value="custom-holidays" className="m-0">
                <CustomHolidaySettings />
              </TabsContent>
              <TabsContent value="recurring-lessons" className="m-0">
                <RecurringLessonsSettings />
              </TabsContent>
              <TabsContent value="theme" className="m-0">
                <ThemeSettings />
              </TabsContent>
              <TabsContent value="data" className="m-0">
                <DataManagement />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}