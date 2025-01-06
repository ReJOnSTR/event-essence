import { addDays, addMonths, addWeeks, startOfMonth, startOfWeek } from "date-fns";
import { ViewType } from "@/store/calendarStore";

export const useCalendarNavigation = (
  selectedDate: Date,
  setSelectedDate: (date: Date) => void
) => {
  const handleNavigationClick = (direction: 'prev' | 'next', view: ViewType) => {
    return () => {
      const amount = direction === 'prev' ? -1 : 1;
      
      switch (view) {
        case 'day':
          setSelectedDate(addDays(selectedDate, amount));
          break;
        case 'week':
          setSelectedDate(addWeeks(selectedDate, amount));
          break;
        case 'month':
          setSelectedDate(addMonths(selectedDate, amount));
          break;
        case 'year':
          const newDate = new Date(selectedDate);
          newDate.setFullYear(selectedDate.getFullYear() + amount);
          setSelectedDate(newDate);
          break;
      }
    };
  };

  const handleTodayClick = () => {
    setSelectedDate(new Date());
  };

  return {
    handleNavigationClick,
    handleTodayClick
  };
};