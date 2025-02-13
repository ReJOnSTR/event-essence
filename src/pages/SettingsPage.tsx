
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
import { useState } from "react";
import {
  Clock,
  Calendar,
  Repeat,
  Palette,
  Database,
  Settings2,
  ChevronLeft,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = useState(!isMobile);

  const ActiveComponent = settingsSections.find(
    (section) => section.id === activeSection
  )?.component || GeneralSettings;

  const activeTitle = settingsSections.find(
    (section) => section.id === activeSection
  )?.title;

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      <PageHeader
        title={isMobile ? activeTitle || "Ayarlar" : "Ayarlar"}
        backTo="/"
        backLabel="Takvime Dön"
      />
      <div className="flex-1 flex md:gap-6 p-4 md:p-6 relative">
        {/* Mobil menü butonu */}
        {isMobile && !showSidebar && (
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg"
            onClick={toggleSidebar}
          >
            <Settings2 className="h-4 w-4" />
          </Button>
        )}

        {/* Kenar çubuğu */}
        <div
          className={cn(
            "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden transition-opacity",
            showSidebar ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={() => setShowSidebar(false)}
        />
        
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r p-4 transition-transform duration-200 ease-in-out md:static md:translate-x-0",
            showSidebar ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => setShowSidebar(false)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          <div className="space-y-1 mt-isMobile ? 8 : 0">
            {settingsSections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  activeSection === section.id && "bg-muted"
                )}
                onClick={() => {
                  setActiveSection(section.id);
                  if (isMobile) setShowSidebar(false);
                }}
              >
                {section.icon}
                {section.title}
              </Button>
            ))}
          </div>
        </div>

        {/* Ana içerik */}
        <div className={cn("flex-1 max-w-3xl mx-auto w-full", isMobile ? "mt-0" : "")}>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="pr-4 md:pr-6">
              <ActiveComponent />
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
