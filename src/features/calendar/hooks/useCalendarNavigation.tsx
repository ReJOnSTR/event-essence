import { addDays, subDays, addWeeks, subWeeks, addMonths, subMonths, addYears, subYears } from "date-fns";
import { ViewType } from "@/store/calendarStore";

export function useCalendarNavigation(selectedDate: Date, setSelectedDate: (date: Date) => void) {
  const handleNavigationClick = (direction: 'prev' | 'next', currentView: ViewType) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    switch (currentView) {
      case 'day':
        setSelectedDate(direction === 'next' ? addDays(selectedDate, 1) : subDays(selectedDate, 1));
        break;
      case 'week':
        setSelectedDate(direction === 'next' ? addWeeks(selectedDate, 1) : subWeeks(selectedDate, 1));
        break;
      case 'month':
        setSelectedDate(direction === 'next' ? addMonths(selectedDate, 1) : subMonths(selectedDate, 1));
        break;
      case 'year':
        setSelectedDate(direction === 'next' ? addYears(selectedDate, 1) : subYears(selectedDate, 1));
        break;
    }
  };

  const handleTodayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedDate(new Date());
  };

  return {
    handleNavigationClick,
    handleTodayClick
  };
}