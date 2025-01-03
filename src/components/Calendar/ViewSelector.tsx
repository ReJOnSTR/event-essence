import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ViewSelectorProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export default function ViewSelector({ currentView, onViewChange }: ViewSelectorProps) {
  return (
    <Tabs value={currentView} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="day" onClick={() => onViewChange("day")}>
          Günlük
        </TabsTrigger>
        <TabsTrigger value="week" onClick={() => onViewChange("week")}>
          Haftalık
        </TabsTrigger>
        <TabsTrigger value="month" onClick={() => onViewChange("month")}>
          Aylık
        </TabsTrigger>
        <TabsTrigger value="year" onClick={() => onViewChange("year")}>
          Yıllık
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}