import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ViewType = 'day' | 'week' | 'month' | 'year';

interface CalendarState {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set) => ({
      currentView: 'month',
      setCurrentView: (view) => set({ currentView: view }),
    }),
    {
      name: 'calendar-storage',
    }
  )
);