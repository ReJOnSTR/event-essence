import { create } from 'zustand';
import { Student } from '@/types/calendar';

interface StudentState {
  isDialogOpen: boolean;
  selectedStudent: Student | undefined;
  openDialog: () => void;
  closeDialog: () => void;
  setSelectedStudent: (student: Student | undefined) => void;
}

export const useStudentStore = create<StudentState>((set) => ({
  isDialogOpen: false,
  selectedStudent: undefined,
  openDialog: () => set({ isDialogOpen: true }),
  closeDialog: () => set({ isDialogOpen: false, selectedStudent: undefined }),
  setSelectedStudent: (student) => set({ selectedStudent: student, isDialogOpen: true }),
}));