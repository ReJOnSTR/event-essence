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
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="w-full justify-start mb-4 overflow-auto flex-wrap gap-2">
              <TabsTrigger value="general" className="flex-shrink-0">Genel</TabsTrigger>
              <TabsTrigger value="working-hours" className="flex-shrink-0">Çalışma Saatleri</TabsTrigger>
              <TabsTrigger value="custom-holidays" className="flex-shrink-0">Tatil Günleri</TabsTrigger>
              <TabsTrigger value="recurring-lessons" className="flex-shrink-0">Tekrarlanan Dersler</TabsTrigger>
              <TabsTrigger value="theme" className="flex-shrink-0">Tema</TabsTrigger>
              <TabsTrigger value="data" className="flex-shrink-0">Veri Yönetimi</TabsTrigger>
            </TabsList>
            <div className="space-y-4">
              <TabsContent value="general" className="mt-0">
                <GeneralSettings />
              </TabsContent>
              <TabsContent value="working-hours" className="mt-0">
                <WorkingHoursSettings />
              </TabsContent>
              <TabsContent value="custom-holidays" className="mt-0">
                <CustomHolidaySettings />
              </TabsContent>
              <TabsContent value="recurring-lessons" className="mt-0">
                <RecurringLessonsSettings />
              </TabsContent>
              <TabsContent value="theme" className="mt-0">
                <ThemeSettings />
              </TabsContent>
              <TabsContent value="data" className="mt-0">
                <DataManagement />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}