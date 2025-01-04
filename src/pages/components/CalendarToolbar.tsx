import { Button } from "@/components/ui/button";
import { ViewType, useCalendarStore } from "@/store/calendarStore";
import { useCalendarNavigation } from "@/features/calendar/hooks/useCalendarNavigation";

interface CalendarToolbarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export default function CalendarToolbar({ selectedDate, setSelectedDate }: CalendarToolbarProps) {
  const { currentView, setCurrentView } = useCalendarStore();
  const { handleNavigationClick, handleTodayClick } = useCalendarNavigation(selectedDate, setSelectedDate);

  return (
    <div className="flex items-center gap-2 p-4 border-b">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleNavigationClick('prev', currentView)()}
      >
        Önceki
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleTodayClick}
      >
        Bugün
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleNavigationClick('next', currentView)()}
      >
        Sonraki
      </Button>
      <div className="ml-auto space-x-2">
        <Button
          variant={currentView === 'day' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCurrentView('day' as ViewType)}
        >
          Gün
        </Button>
        <Button
          variant={currentView === 'week' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCurrentView('week' as ViewType)}
        >
          Hafta
        </Button>
        <Button
          variant={currentView === 'month' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCurrentView('month' as ViewType)}
        >
          Ay
        </Button>
        <Button
          variant={currentView === 'year' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCurrentView('year' as ViewType)}
        >
          Yıl
        </Button>
      </div>
    </div>
  );
}