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
} from "lucide-react";

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

  const ActiveComponent = settingsSections.find(
    (section) => section.id === activeSection
  )?.component || GeneralSettings;

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        title="Ayarlar"
        backTo="/"
        backLabel="Takvime Dön"
      />
      <div className="flex-1 flex gap-6 p-6">
        <div className="w-64 flex-shrink-0">
          <div className="space-y-1">
            {settingsSections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
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
            <div className="pr-6">
              <ActiveComponent />
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}