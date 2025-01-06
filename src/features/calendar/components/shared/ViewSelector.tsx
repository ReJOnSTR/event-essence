import { Button } from "@/components/ui/button";
import { ViewType } from "@/store/calendarStore";
import { cn } from "@/lib/utils";

interface ViewSelectorProps {
  currentView: string;
  onViewChange: (view: ViewType) => void;
}

export default function ViewSelector({ currentView, onViewChange }: ViewSelectorProps) {
  const views: { label: string; value: ViewType }[] = [
    { label: "Gün", value: "day" },
    { label: "Hafta", value: "week" },
    { label: "Ay", value: "month" },
    { label: "Yıl", value: "year" },
  ];

  return (
    <div className="flex gap-1 md:gap-2">
      {views.map(view => (
        <Button
          key={view.value}
          variant="ghost"
          size="sm"
          onClick={() => onViewChange(view.value)}
          className={cn(
            "font-normal hover:bg-accent hover:text-accent-foreground",
            currentView === view.value && "bg-accent text-accent-foreground"
          )}
        >
          {view.label}
        </Button>
      ))}
    </div>
  );
}