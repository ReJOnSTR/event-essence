import { PageHeader } from "@/components/Layout/PageHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import GeneralSettings from "@/components/Settings/GeneralSettings";
import WorkingHoursSettings from "@/components/Settings/WorkingHoursSettings";
import CustomHolidaySettings from "@/components/Settings/CustomHolidaySettings";
import DataManagement from "@/components/Settings/DataManagement";
import ThemeSettings from "@/components/Settings/ThemeSettings";
import RecurringLessonsSettings from "@/components/Settings/RecurringLessonsSettings";
import { ChevronRight, Settings2, Clock, Gift, Repeat, Palette, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SettingItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

export default function SettingsPage() {
  const navigate = useNavigate();

  const settings: SettingItem[] = [
    {
      id: "general",
      title: "Genel",
      icon: <Settings2 className="h-4 w-4" />,
      component: <GeneralSettings />
    },
    {
      id: "working-hours",
      title: "Çalışma Saatleri",
      icon: <Clock className="h-4 w-4" />,
      component: <WorkingHoursSettings />
    },
    {
      id: "custom-holidays",
      title: "Tatil Günleri",
      icon: <Gift className="h-4 w-4" />,
      component: <CustomHolidaySettings />
    },
    {
      id: "recurring-lessons",
      title: "Tekrarlanan Dersler",
      icon: <Repeat className="h-4 w-4" />,
      component: <RecurringLessonsSettings />
    },
    {
      id: "theme",
      title: "Tema",
      icon: <Palette className="h-4 w-4" />,
      component: <ThemeSettings />
    },
    {
      id: "data",
      title: "Veri Yönetimi",
      icon: <Database className="h-4 w-4" />,
      component: <DataManagement />
    }
  ];

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        title="Ayarlar"
        backTo="/"
        backLabel="Takvime Dön"
      />

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {settings.map((setting) => (
            <button
              key={setting.id}
              onClick={() => navigate(`/settings/${setting.id}`)}
              className="w-full flex items-center justify-between p-4 rounded-lg bg-card hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                {setting.icon}
                <span className="font-medium">{setting.title}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}