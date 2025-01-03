import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCalendarViewStore } from "@/stores/calendarViewStore";

interface ViewSelectorProps {
  onViewChange: (view: string) => void;
}

export default function ViewSelector({ onViewChange }: ViewSelectorProps) {
  const { currentView, setCurrentView } = useCalendarViewStore();

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    onViewChange(view);
  };

  return (
    <Tabs value={currentView} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="day" onClick={() => handleViewChange("day")}>
          Günlük
        </TabsTrigger>
        <TabsTrigger value="week" onClick={() => handleViewChange("week")}>
          Haftalık
        </TabsTrigger>
        <TabsTrigger value="month" onClick={() => handleViewChange("month")}>
          Aylık
        </TabsTrigger>
        <TabsTrigger value="year" onClick={() => handleViewChange("year")}>
          Yıllık
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}