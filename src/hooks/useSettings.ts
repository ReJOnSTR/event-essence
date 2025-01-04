import { create } from 'zustand';

interface SettingsState {
  defaultLessonDuration: number;
  setDefaultLessonDuration: (duration: number) => void;
}

export const useSettings = create<SettingsState>((set) => ({
  defaultLessonDuration: Number(localStorage.getItem('defaultLessonDuration')) || 30,
  setDefaultLessonDuration: (duration: number) => {
    localStorage.setItem('defaultLessonDuration', duration.toString());
    set({ defaultLessonDuration: duration });
  },
}));