import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ViewSelector } from "./ViewSelector";

interface CalendarPageHeaderProps {
  currentDate: Date;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  view: string;
  onViewChange: (view: string) => void;
}

export function CalendarPageHeader({
  currentDate,
  onPrevious,
  onNext,
  onToday,
  view,
  onViewChange,
}: CalendarPageHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onPrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={onToday}>
          Bugün
        </Button>
        <h2 className="text-lg font-semibold">
          {format(currentDate, "MMMM yyyy", { locale: tr })}
        </h2>
      </div>
      <ViewSelector view={view} onViewChange={onViewChange} />
    </div>
  );
}