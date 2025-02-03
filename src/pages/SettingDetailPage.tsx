import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/Layout/PageHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import GeneralSettings from "@/components/Settings/GeneralSettings";
import WorkingHoursSettings from "@/components/Settings/WorkingHoursSettings";
import CustomHolidaySettings from "@/components/Settings/CustomHolidaySettings";
import DataManagement from "@/components/Settings/DataManagement";
import ThemeSettings from "@/components/Settings/ThemeSettings";
import RecurringLessonsSettings from "@/components/Settings/RecurringLessonsSettings";

const SETTINGS_COMPONENTS = {
  general: {
    title: "Genel Ayarlar",
    component: GeneralSettings
  },
  "working-hours": {
    title: "Çalışma Saatleri",
    component: WorkingHoursSettings
  },
  "custom-holidays": {
    title: "Tatil Günleri",
    component: CustomHolidaySettings
  },
  "recurring-lessons": {
    title: "Tekrarlanan Dersler",
    component: RecurringLessonsSettings
  },
  theme: {
    title: "Tema Ayarları",
    component: ThemeSettings
  },
  data: {
    title: "Veri Yönetimi",
    component: DataManagement
  }
};

export default function SettingDetailPage() {
  const { settingId = "general" } = useParams();
  const navigate = useNavigate();
  
  const setting = SETTINGS_COMPONENTS[settingId as keyof typeof SETTINGS_COMPONENTS];
  
  if (!setting) {
    navigate("/settings");
    return null;
  }

  const Component = setting.component;

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        title={setting.title}
        backTo="/settings"
        backLabel="Ayarlara Dön"
      />
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Component />
        </div>
      </ScrollArea>
    </div>
  );
}