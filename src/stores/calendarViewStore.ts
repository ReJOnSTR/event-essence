import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CalendarViewState {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const useCalendarViewStore = create<CalendarViewState>()(
  persist(
    (set) => ({
      currentView: 'month',
      setCurrentView: (view) => set({ currentView: view }),
    }),
    {
      name: 'calendar-view-storage',
    }
  )
);