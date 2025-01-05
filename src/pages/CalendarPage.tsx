import React, { useState } from "react";
import { useCalendarStore, ViewType } from "@/store/calendarStore";
import { useStudents } from "@/hooks/useStudents";
import { useLessons } from "@/hooks/useLessons";
import { CalendarEvent } from "@/types/calendar";
import CalendarPageHeader from "@/components/Calendar/CalendarPageHeader";
import LessonDialog from "@/components/Calendar/LessonDialog";
import StudentDialog from "@/components/Students/StudentDialog";
import CalendarContent from "@/features/calendar/components/CalendarContent";
import { useCalendarNavigation } from "@/features/calendar/hooks/useCalendarNavigation";
import { PageHeader } from "@/components/Layout/PageHeader";
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useStudentDialog } from "@/features/students/hooks/useStudentDialog";
import { CalendarActions } from "@/features/calendar/components/CalendarActions";

interface CalendarPageProps {
  headerHeight: number;
}

export default function CalendarPage({ headerHeight }: CalendarPageProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedLesson, setSelectedLesson] = useState<CalendarEvent | undefined>();
  
  const { currentView, setCurrentView } = useCalendarStore();
  const { students } = useStudents();
  const { lessons, saveLesson, deleteLesson } = useLessons();
  const { handleNavigationClick, handleTodayClick } = useCalendarNavigation(selectedDate, setSelectedDate);
  const { session } = useSessionContext();
  const studentDialog = useStudentDialog();

  // Add event listener for opening student dialog
  React.useEffect(() => {
    const handleOpenStudentDialog = () => {
      studentDialog.setIsOpen(true);
    };
    window.addEventListener('openStudentDialog', handleOpenStudentDialog);
    return () => {
      window.removeEventListener('openStudentDialog', handleOpenStudentDialog);
    };
  }, [studentDialog]);

  const handleDateSelect = (date: Date) => {
    if (!session) return;
    setSelectedDate(date);
    setSelectedLesson(undefined);
    setIsDialogOpen(true);
  };

  const handleLessonClick = (lesson: CalendarEvent) => {
    if (!session) return;
    setSelectedLesson(lesson);
    setSelectedDate(lesson.start);
    setIsDialogOpen(true);
  };

  const handleSaveLesson = (lessonData: Omit<CalendarEvent, "id">) => {
    if (!session) return;
    
    const lessonToSave = selectedLesson
      ? { ...lessonData, id: selectedLesson.id }
      : { ...lessonData, id: crypto.randomUUID() };
      
    saveLesson(lessonToSave);
    setIsDialogOpen(false);
    setSelectedLesson(undefined);
  };

  const handleDeleteLesson = (lessonId: string) => {
    if (!session) return;
    deleteLesson(lessonId);
    setIsDialogOpen(false);
    setSelectedLesson(undefined);
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    if (!session) return;
    saveLesson(updatedEvent);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <PageHeader title="Takvim">
        <CalendarActions 
          lessons={lessons} 
          students={students}
          onAddLesson={() => {
            setSelectedLesson(undefined);
            setIsDialogOpen(true);
          }}
        />
      </PageHeader>

      <CalendarPageHeader
        date={selectedDate}
        currentView={currentView}
        onViewChange={(view: ViewType) => setCurrentView(view)}
        onPrevious={handleNavigationClick('prev', currentView)}
        onNext={handleNavigationClick('next', currentView)}
        onToday={handleTodayClick}
      />
      
      <div className="flex-1 overflow-auto bg-background">
        <div className="p-2 md:p-4">
          <CalendarContent
            currentView={currentView}
            selectedDate={selectedDate}
            lessons={lessons}
            onDateSelect={handleDateSelect}
            onEventClick={handleLessonClick}
            onEventUpdate={handleEventUpdate}
            students={students}
          />
        </div>
      </div>
      
      {session && (
        <>
          <LessonDialog
            isOpen={isDialogOpen}
            onClose={() => {
              setIsDialogOpen(false);
              setSelectedLesson(undefined);
            }}
            onSave={handleSaveLesson}
            onDelete={handleDeleteLesson}
            selectedDate={selectedDate}
            event={selectedLesson}
            events={lessons}
            students={students}
          />

          <StudentDialog
            isOpen={studentDialog.isOpen}
            onClose={studentDialog.handleClose}
            onSave={studentDialog.handleSave}
            onDelete={studentDialog.handleDelete}
            student={studentDialog.selectedStudent}
            studentName={studentDialog.studentName}
            setStudentName={studentDialog.setStudentName}
            studentPrice={studentDialog.studentPrice}
            setStudentPrice={studentDialog.setStudentPrice}
            studentColor={studentDialog.studentColor}
            setStudentColor={studentDialog.setStudentColor}
          />
        </>
      )}
    </div>
  );
}