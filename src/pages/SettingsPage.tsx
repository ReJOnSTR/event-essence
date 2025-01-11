import { PageHeader } from "@/components/Layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import GeneralSettings from "@/components/Settings/GeneralSettings";
import WorkingHoursSettings from "@/components/Settings/WorkingHoursSettings";
import CustomHolidaySettings from "@/components/Settings/CustomHolidaySettings";
import DataManagement from "@/components/Settings/DataManagement";
import ThemeSettings from "@/components/Settings/ThemeSettings";
import { useSessionContext } from '@supabase/auth-helpers-react';
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { session } = useSessionContext();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <motion.div 
      className="flex-1 flex flex-col h-full overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <PageHeader
        title="Ayarlar"
        backTo="/"
        backLabel="Takvime Dön"
      />

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="w-full justify-start mb-4 overflow-x-auto flex-nowrap">
              <TabsTrigger value="general">Genel</TabsTrigger>
              <TabsTrigger value="working-hours">Çalışma Saatleri</TabsTrigger>
              <TabsTrigger value="custom-holidays">Tatil Günleri</TabsTrigger>
              <TabsTrigger value="theme">Tema</TabsTrigger>
              <TabsTrigger value="data">Veri Yönetimi</TabsTrigger>
            </TabsList>
            <div className="space-y-4">
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
            </div>
          </Tabs>
        </div>
      </ScrollArea>
    </motion.div>
  );
}