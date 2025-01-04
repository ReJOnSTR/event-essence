import { PageHeader } from "@/components/Layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider, Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import GeneralSettings from "@/components/Settings/GeneralSettings";
import WorkingHoursSettings from "@/components/Settings/WorkingHoursSettings";
import CustomHolidaySettings from "@/components/Settings/CustomHolidaySettings";
import DataManagement from "@/components/Settings/DataManagement";
import ThemeSettings from "@/components/Settings/ThemeSettings";
import SideMenu from "@/components/Layout/SideMenu";
import { motion, AnimatePresence } from "framer-motion";

const tabVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: {
      duration: 0.2
    }
  }
};

const tabContentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

export default function SettingsPage() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar>
          <SidebarContent className="p-4">
            <SideMenu />
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <PageHeader
              title="Ayarlar"
              backTo="/"
              backLabel="Takvime Dön"
            />
          </motion.div>

          <ScrollArea className="flex-1">
            <div className="p-4">
              <Tabs defaultValue="general" className="w-full">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <TabsList className="w-full justify-start mb-4">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <TabsTrigger value="general">Genel</TabsTrigger>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <TabsTrigger value="working-hours">Çalışma Saatleri</TabsTrigger>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <TabsTrigger value="custom-holidays">Tatil Günleri</TabsTrigger>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <TabsTrigger value="theme">Tema</TabsTrigger>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <TabsTrigger value="data">Veri Yönetimi</TabsTrigger>
                    </motion.div>
                  </TabsList>
                </motion.div>

                <AnimatePresence mode="wait">
                  <motion.div
                    variants={tabContentVariants}
                    initial="hidden"
                    animate="visible"
                  >
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
                  </motion.div>
                </AnimatePresence>
              </Tabs>
            </div>
          </ScrollArea>
        </div>
      </div>
    </SidebarProvider>
  );
}