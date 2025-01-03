import { create } from 'zustand';

type ViewType = 'day' | 'week' | 'month' | 'year';

interface CalendarState {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  currentView: 'month',
  setCurrentView: (view) => set({ currentView: view }),
}));

export type { ViewType };