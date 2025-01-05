import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCalendarStore, ViewType } from "@/store/calendarStore";
import { useStudents } from "@/hooks/useStudents";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
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
  const navigate = useNavigate();
  const session = useSession();
  const { toast } = useToast();

  // Check for authentication
  useEffect(() => {
    if (!session) {
      toast({
        title: "Oturum Hatası",
        description: "Lütfen önce giriş yapın",
        variant: "destructive"
      });
      navigate('/login');
    }
  }, [session, navigate, toast]);

  const { handleNavigationClick, handleTodayClick } = useCalendarNavigation(selectedDate, setSelectedDate);

  const {
    lessons,
    handleSaveLesson,
    handleDeleteLesson,
    handleEventUpdate,
  } = useCalendarEvents();

  const {
    isDialogOpen,
    selectedLesson,
    dialogSelectedDate,
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

  const handleSaveStudent = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Hata",
        description: "Oturum açmanız gerekiyor",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    const studentData = {
      name: studentDialogState.studentName,
      price: studentDialogState.studentPrice,
      color: studentDialogState.studentColor,
    };
    
    try {
      await saveStudent(studentData);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving student:', error);
      toast({
        title: "Hata",
        description: "Öğrenci kaydedilirken bir hata oluştu",
        variant: "destructive"
      });
    }
  };

  // Save lessons to localStorage
  React.useEffect(() => {
    localStorage.setItem('lessons', JSON.stringify(lessons));
  }, [lessons]);

  if (!session) {
    return null;
  }

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