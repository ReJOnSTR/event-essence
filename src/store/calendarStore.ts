import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type ViewType = 'day' | 'week' | 'month' | 'year';

interface CalendarState {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useCalendarStore = create<CalendarState>()(
  devtools(
    (set) => ({
      currentView: 'month',
      setCurrentView: (view) => set({ currentView: view }),
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'calendar-store',
    }
  )
);