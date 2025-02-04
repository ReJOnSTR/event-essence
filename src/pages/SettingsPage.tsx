import { PageHeader } from "@/components/Layout/PageHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import GeneralSettings from "@/components/Settings/GeneralSettings";
import WorkingHoursSettings from "@/components/Settings/WorkingHoursSettings";
import CustomHolidaySettings from "@/components/Settings/CustomHolidaySettings";
import DataManagement from "@/components/Settings/DataManagement";
import ThemeSettings from "@/components/Settings/ThemeSettings";
import RecurringLessonsSettings from "@/components/Settings/RecurringLessonsSettings";
import { ChevronRight } from "lucide-react";

const menuItems = [
  { path: "general", label: "Genel", component: GeneralSettings },
  { path: "working-hours", label: "Çalışma Saatleri", component: WorkingHoursSettings },
  { path: "custom-holidays", label: "Tatil Günleri", component: CustomHolidaySettings },
  { path: "recurring-lessons", label: "Tekrarlanan Dersler", component: RecurringLessonsSettings },
  { path: "theme", label: "Tema", component: ThemeSettings },
  { path: "data", label: "Veri Yönetimi", component: DataManagement },
];

function SettingsMenu() {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-2">
      {menuItems.map((item) => (
        <Button
          key={item.path}
          variant="ghost"
          className="w-full justify-between"
          onClick={() => navigate(`/settings/${item.path}`)}
        >
          {item.label}
          <ChevronRight className="h-4 w-4" />
        </Button>
      ))}
    </div>
  );
}

export default function SettingsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isRoot = location.pathname === "/settings";
  const currentPath = location.pathname.split("/").pop();
  const currentItem = menuItems.find(item => item.path === currentPath);

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        title={isRoot ? "Ayarlar" : currentItem?.label || "Ayarlar"}
        backTo={isRoot ? "/" : "/settings"}
        backLabel={isRoot ? "Takvime Dön" : "Ayarlara Dön"}
      />

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Routes>
            <Route index element={<SettingsMenu />} />
            {menuItems.map((item) => (
              <Route
                key={item.path}
                path={`${item.path}/*`}
                element={<item.component />}
              />
            ))}
          </Routes>
        </div>
      </ScrollArea>
    </div>
  );
}