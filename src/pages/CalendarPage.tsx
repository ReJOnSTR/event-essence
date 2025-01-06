import React from "react";
import { useCalendarStore } from "@/store/calendarStore";
import { useStudents } from "@/hooks/useStudents";
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useStudentDialog } from "@/features/students/hooks/useStudentDialog";
import CalendarPageHeader from "@/components/Calendar/CalendarPageHeader";
import LessonDialog from "@/components/Calendar/LessonDialog";
import StudentDialog from "@/components/Students/StudentDialog";
import CalendarContent from "@/features/calendar/components/CalendarContent";
import { useCalendarNavigation } from "@/features/calendar/hooks/useCalendarNavigation";
import { PageHeader } from "@/components/Layout/PageHeader";
import { useCalendarEvents } from "@/features/calendar/hooks/useCalendarEvents";
import CalendarHeader from "@/features/calendar/components/CalendarHeader";
import LoginDialog from "@/features/calendar/components/LoginDialog";

interface CalendarPageProps {
  headerHeight: number;
}

export default function CalendarPage({ headerHeight }: CalendarPageProps) {
  const { currentView, setCurrentView } = useCalendarStore();
  const { students } = useStudents();
  const { session } = useSessionContext();
  const studentDialog = useStudentDialog();
  
  const {
    isDialogOpen,
    setIsDialogOpen,
    isLoginDialogOpen,
    setIsLoginDialogOpen,
    selectedDate,
    setSelectedDate,
    selectedLesson,
    setSelectedLesson,
    lessons,
    handleDateSelect,
    handleLessonClick,
    handleSaveLesson,
    handleDeleteLesson,
    handleEventUpdate
  } = useCalendarEvents();

  const { handleNavigationClick, handleTodayClick } = useCalendarNavigation(
    selectedDate, 
    setSelectedDate
  );

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <PageHeader title="Takvim">
        <CalendarHeader
          session={session}
          setIsLoginDialogOpen={setIsLoginDialogOpen}
          setSelectedLesson={setSelectedLesson}
          setIsDialogOpen={setIsDialogOpen}
          lessons={lessons}
          students={students}
        />
      </PageHeader>

      <CalendarPageHeader
        date={selectedDate}
        currentView={currentView}
        onViewChange={setCurrentView}
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
            onDateSelect={(date) => handleDateSelect(session, date)}
            onEventClick={(event) => handleLessonClick(session, event)}
            onEventUpdate={(event) => handleEventUpdate(session, event)}
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
            onSave={(lesson) => handleSaveLesson(session, lesson)}
            onDelete={(id) => handleDeleteLesson(session, id)}
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

      <LoginDialog 
        isOpen={isLoginDialogOpen}
        onOpenChange={setIsLoginDialogOpen}
      />
    </div>
  );
}