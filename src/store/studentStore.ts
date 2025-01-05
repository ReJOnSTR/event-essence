import { create } from 'zustand';
import { Student } from '@/types/calendar';

interface StudentState {
  isDialogOpen: boolean;
  selectedStudent: Student | undefined;
  studentName: string;
  studentPrice: number;
  studentColor: string;
  openDialog: () => void;
  closeDialog: () => void;
  setSelectedStudent: (student: Student | undefined) => void;
  setStudentName: (name: string) => void;
  setStudentPrice: (price: number) => void;
  setStudentColor: (color: string) => void;
  resetForm: () => void;
}

export const useStudentStore = create<StudentState>((set) => ({
  isDialogOpen: false,
  selectedStudent: undefined,
  studentName: "",
  studentPrice: 0,
  studentColor: "#1a73e8",
  openDialog: () => set({ isDialogOpen: true }),
  closeDialog: () => {
    set({ 
      isDialogOpen: false, 
      selectedStudent: undefined,
      studentName: "",
      studentPrice: 0,
      studentColor: "#1a73e8"
    });
  },
  setSelectedStudent: (student) => set({ 
    selectedStudent: student,
    studentName: student?.name || "",
    studentPrice: student?.price || 0,
    studentColor: student?.color || "#1a73e8",
    isDialogOpen: true 
  }),
  setStudentName: (name) => set({ studentName: name }),
  setStudentPrice: (price) => set({ studentPrice: price }),
  setStudentColor: (color) => set({ studentColor: color }),
  resetForm: () => set({
    studentName: "",
    studentPrice: 0,
    studentColor: "#1a73e8"
  })
}));