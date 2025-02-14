
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/Layout/PageHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import GeneralSettings from "@/components/Settings/GeneralSettings";
import WorkingHoursSettings from "@/components/Settings/WorkingHoursSettings";
import CustomHolidaySettings from "@/components/Settings/CustomHolidaySettings";
import DataManagement from "@/components/Settings/DataManagement";
import ThemeSettings from "@/components/Settings/ThemeSettings";
import RecurringLessonsSettings from "@/components/Settings/RecurringLessonsSettings";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Calendar,
  Repeat,
  Palette,
  Database,
  Settings2,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMobile } from "@/hooks/use-mobile";

type SettingsSection = {
  id: string;
  title: string;
  icon: React.ReactNode;
  component: React.ComponentType;
};

const settingsSections: SettingsSection[] = [
  {
    id: "general",
    title: "Genel",
    icon: <Settings2 className="w-4 h-4" />,
    component: GeneralSettings,
  },
  {
    id: "working-hours",
    title: "Çalışma Saatleri",
    icon: <Clock className="w-4 h-4" />,
    component: WorkingHoursSettings,
  },
  {
    id: "custom-holidays",
    title: "Tatil Günleri",
    icon: <Calendar className="w-4 h-4" />,
    component: CustomHolidaySettings,
  },
  {
    id: "recurring-lessons",
    title: "Tekrarlanan Dersler",
    icon: <Repeat className="w-4 h-4" />,
    component: RecurringLessonsSettings,
  },
  {
    id: "theme",
    title: "Tema",
    icon: <Palette className="w-4 h-4" />,
    component: ThemeSettings,
  },
  {
    id: "data",
    title: "Veri Yönetimi",
    icon: <Database className="w-4 h-4" />,
    component: DataManagement,
  },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("general");
  const [searchTerm, setSearchTerm] = useState("");
  const isMobile = useMobile();

  const filteredSections = settingsSections.filter((section) =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ActiveComponent = settingsSections.find(
    (section) => section.id === activeSection
  )?.component || GeneralSettings;

  // Mobil cihazlarda sekme değiştiğinde otomatik scroll
  useEffect(() => {
    if (isMobile) {
      const contentElement = document.getElementById(`content-${activeSection}`);
      if (contentElement) {
        contentElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [activeSection, isMobile]);

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader title="Ayarlar" backTo="/" backLabel="Takvime Dön" />
      
      <div className="flex-1 p-4 md:p-6 space-y-4">
        {/* Mobil Görünüm */}
        {isMobile ? (
          <Tabs
            defaultValue={activeSection}
            onValueChange={setActiveSection}
            className="w-full"
          >
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md pb-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Ayarlarda ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <ScrollArea className="w-full">
                <TabsList className="inline-flex w-auto border bg-background/50 backdrop-blur-sm p-1 h-auto">
                  {filteredSections.map((section) => (
                    <TabsTrigger
                      key={section.id}
                      value={section.id}
                      className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      {section.icon}
                      <span className="hidden sm:inline">{section.title}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <TabsContent value={activeSection} className="mt-4">
                  <ActiveComponent />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        ) : (
          // Masaüstü Görünüm
          <div className="flex gap-6">
            <div className="w-64 flex-shrink-0 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Ayarlarda ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="space-y-1">
                {filteredSections.map((section) => (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-2 h-auto py-3",
                      activeSection === section.id && "bg-muted"
                    )}
                    onClick={() => setActiveSection(section.id)}
                  >
                    {section.icon}
                    {section.title}
                  </Button>
                ))}
              </div>
            </div>
            <Separator orientation="vertical" className="h-auto" />
            <div className="flex-1 max-w-3xl">
              <ScrollArea className="h-[calc(100vh-10rem)]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="pr-6"
                  >
                    <ActiveComponent />
                  </motion.div>
                </AnimatePresence>
              </ScrollArea>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
