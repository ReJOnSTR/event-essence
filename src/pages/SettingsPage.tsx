import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Clock, Palette, Upload } from "lucide-react";
import { PageHeader } from "@/components/Layout/PageHeader";
import GeneralSettings from "@/components/Settings/GeneralSettings";
import WorkingHoursSettings from "@/components/Settings/WorkingHoursSettings";
import ThemeSettings from "@/components/Settings/ThemeSettings";
import DataManagement from "@/components/Settings/DataManagement";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="min-h-screen bg-gray-50/50">
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
  );
}
