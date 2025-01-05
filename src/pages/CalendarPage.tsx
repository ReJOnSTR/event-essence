import React, { useState } from "react";
import { useCalendarStore, ViewType } from "@/store/calendarStore";
import { useStudents } from "@/hooks/useStudents";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CalendarPageHeader from "@/components/Calendar/CalendarPageHeader";
import LessonDialog from "@/components/Calendar/LessonDialog";
import { WeeklySchedulePdf } from "@/components/Calendar/WeeklySchedulePdf";
import CalendarContent from "@/features/calendar/components/CalendarContent";
import { useCalendarNavigation } from "@/features/calendar/hooks/useCalendarNavigation";
import { PageHeader } from "@/components/Layout/PageHeader";
import { useCalendarEvents } from "@/features/calendar/hooks/useCalendarEvents";
import { useCalendarDialog } from "@/features/calendar/hooks/useCalendarDialog";
import { useSession } from "@supabase/auth-helpers-react";

interface CalendarPageProps {
  headerHeight: number;
}

export default function CalendarPage({ headerHeight }: CalendarPageProps) {
  const { currentView, setCurrentView } = useCalendarStore();
  const { students, saveStudent } = useStudents();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { handleNavigationClick, handleTodayClick } = useCalendarNavigation(selectedDate, setSelectedDate);
  const session = useSession();

  const {
    lessons,
    handleSaveLesson,
    handleDeleteLesson,
    handleEventUpdate,
  } = useCalendarEvents();

  const {
    isDialogOpen,
    selectedLesson,
    selectedDate: dialogSelectedDate,
    handleDateSelect,
    handleLessonClick,
    handleCloseDialog,
    setIsDialogOpen,
  } = useCalendarDialog();

  // Student dialog state
  const [studentDialogState, setStudentDialogState] = useState({
    selectedStudent: undefined,
    studentName: "",
    studentPrice: 0,
    studentColor: "#1a73e8"
  });

  const handleSaveStudent = () => {
    if (!session?.user?.id) return;
    
    const studentData = {
      name: studentDialogState.studentName,
      price: studentDialogState.studentPrice,
      color: studentDialogState.studentColor,
    };
    
    saveStudent(studentData);
    setIsDialogOpen(false);
  };

  // Save lessons to localStorage
  React.useEffect(() => {
    localStorage.setItem('lessons', JSON.stringify(lessons));
  }, [lessons]);

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <PageHeader title="Takvim">
        <div className="flex items-center gap-1 md:gap-2">
          <WeeklySchedulePdf lessons={lessons} students={students} />
          <Button 
            size="sm"
            onClick={() => {
              setIsDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden md:inline">Ders Ekle</span>
            <span className="md:hidden">Ekle</span>
          </Button>
        </div>
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
      
      <LessonDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveLesson}
        onDelete={handleDeleteLesson}
        selectedDate={dialogSelectedDate}
        event={selectedLesson}
        events={lessons}
        students={students}
      />
    </div>
  );
}