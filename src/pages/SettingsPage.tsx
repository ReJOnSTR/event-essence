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
  ChevronRight,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const ActiveComponent = settingsSections.find(
    (section) => section.id === activeSection
  )?.component || GeneralSettings;

  const activeTitle = settingsSections.find(
    (section) => section.id === activeSection
  )?.title || "Genel";

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  const SidebarContent = () => (
    <div className="space-y-1">
      {settingsSections.map((section) => (
        <Button
          key={section.id}
          variant={activeSection === section.id ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start gap-2",
            activeSection === section.id && "bg-muted"
          )}
          onClick={() => handleSectionChange(section.id)}
        >
          {section.icon}
          <span className="flex-1 text-left">{section.title}</span>
          {activeSection === section.id && (
            <ChevronRight className="w-4 h-4 ml-auto" />
          )}
        </Button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <PageHeader
        title="Ayarlar"
        backTo="/"
        backLabel="Takvime Dön"
      />
      
      {/* Mobile Layout */}
      {isMobile ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Section Selector */}
          <div className="px-4 py-2 border-b bg-background shrink-0">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-between"
                >
                  <span className="flex items-center gap-2">
                    {settingsSections.find(s => s.id === activeSection)?.icon}
                    {activeTitle}
                  </span>
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[50vh]">
                <div className="py-4">
                  <h3 className="font-semibold mb-4 px-2">Ayar Kategorileri</h3>
                  <ScrollArea className="h-[40vh]">
                    <SidebarContent />
                  </ScrollArea>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Mobile Content - Fixed height with scroll */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 pb-20">
              <ActiveComponent />
            </div>
          </div>
        </div>
      ) : (
        /* Desktop Layout */
        <div className="flex-1 flex gap-6 p-6">
          <div className="w-64 flex-shrink-0">
            <SidebarContent />
          </div>
          <Separator orientation="vertical" className="h-auto" />
          <div className="flex-1 max-w-3xl">
            <ScrollArea className="h-[calc(100vh-10rem)]">
              <div className="pr-6">
                <ActiveComponent />
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
}