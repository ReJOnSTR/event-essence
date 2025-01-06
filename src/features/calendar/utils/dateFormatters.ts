import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { ViewType } from "@/store/calendarStore";

export const getDateFormat = (currentView: ViewType, isMobile: boolean = false) => {
  if (isMobile) {
    switch (currentView) {
      case 'day':
        return "d MMM EEE";
      case 'week':
        return "MMM yyyy";
      case 'month':
        return "MMM yyyy";
      case 'year':
        return "yyyy";
      default:
        return "MMM yyyy";
    }
  }

  switch (currentView) {
    case 'day':
      return "d MMMM yyyy, EEEE";
    case 'week':
      return "MMMM yyyy";
    case 'month':
      return "MMMM yyyy";
    case 'year':
      return "yyyy";
    default:
      return "MMMM yyyy";
  }
};

export const formatDate = (date: Date, formatStr: string) => {
  return format(date, formatStr, { locale: tr });
};