import LessonDialog from "@/components/Calendar/LessonDialog";
import StudentDialog from "@/components/Students/StudentDialog";
import SearchDialog from "@/components/Calendar/SearchDialog";
import { CalendarEvent, Student } from "@/types/calendar";
import { ViewType } from "@/store/calendarStore";

interface CalendarDialogsProps {
  isDialogOpen: boolean;
  isStudentDialogOpen: boolean;
  isSearchOpen: boolean;
  selectedDate: Date;
  selectedLesson?: CalendarEvent;
  lessons: CalendarEvent[];
  students: Student[];
  studentDialogState: {
    selectedStudent?: Student;
    studentName: string;
    studentPrice: number;
    studentColor: string;
  };
  onCloseDialog: () => void;
  onCloseStudentDialog: () => void;
  onCloseSearchDialog: () => void;
  onSaveLesson: (lessonData: Omit<CalendarEvent, "id">) => void;
  onDeleteLesson: (lessonId: string) => void;
  onSaveStudent: () => void;
  onDeleteStudent: () => void;
  setStudentName: (name: string) => void;
  setStudentPrice: (price: number) => void;
  setStudentColor: (color: string) => void;
  setSelectedDate: (date: Date) => void;
  setCurrentView: (view: ViewType) => void;
}

export default function CalendarDialogs({
  isDialogOpen,
  isStudentDialogOpen,
  isSearchOpen,
  selectedDate,
  selectedLesson,
  lessons,
  students,
  studentDialogState,
  onCloseDialog,
  onCloseStudentDialog,
  onCloseSearchDialog,
  onSaveLesson,
  onDeleteLesson,
  onSaveStudent,
  onDeleteStudent,
  setStudentName,
  setStudentPrice,
  setStudentColor,
  setSelectedDate,
  setCurrentView
}: CalendarDialogsProps) {
  return (
    <>
      <LessonDialog
        isOpen={isDialogOpen}
        onClose={onCloseDialog}
        onSave={onSaveLesson}
        onDelete={onDeleteLesson}
        selectedDate={selectedDate}
        event={selectedLesson}
        students={students}
      />

      <StudentDialog
        isOpen={isStudentDialogOpen}
        onClose={onCloseStudentDialog}
        onSave={onSaveStudent}
        onDelete={onDeleteStudent}
        student={studentDialogState.selectedStudent}
        studentName={studentDialogState.studentName}
        setStudentName={setStudentName}
        studentPrice={studentDialogState.studentPrice}
        setStudentPrice={setStudentPrice}
        studentColor={studentDialogState.studentColor}
        setStudentColor={setStudentColor}
      />

      <SearchDialog
        isOpen={isSearchOpen}
        onClose={onCloseSearchDialog}
        onSelectDate={(date) => {
          setSelectedDate(date);
          setCurrentView('day');
        }}
        lessons={lessons}
        students={students}
      />
    </>
  );
}