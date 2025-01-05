import React from "react";
import { useCalendarStore, ViewType } from "@/store/calendarStore";
import { useStudents } from "@/hooks/useStudents";
import { useLessons } from "@/hooks/useLessons";
import { useToast } from "@/components/ui/use-toast";
import { CalendarEvent } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CalendarPageHeader from "@/components/Calendar/CalendarPageHeader";
import LessonDialog from "@/components/Calendar/LessonDialog";
import StudentDialog from "@/components/Students/StudentDialog";
import { WeeklySchedulePdf } from "@/components/Calendar/WeeklySchedulePdf";
import CalendarContent from "@/features/calendar/components/CalendarContent";
import { useCalendarNavigation } from "@/features/calendar/hooks/useCalendarNavigation";
import { PageHeader } from "@/components/Layout/PageHeader";
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useNavigate } from "react-router-dom";

interface CalendarPageProps {
  headerHeight: number;
}

export default function CalendarPage({ headerHeight }: CalendarPageProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [selectedLesson, setSelectedLesson] = React.useState<CalendarEvent | undefined>();
  
  const { currentView, setCurrentView } = useCalendarStore();
  const { students } = useStudents();
  const { lessons, saveLesson, deleteLesson } = useLessons();
  const { toast } = useToast();
  const { session } = useSessionContext();
  const navigate = useNavigate();

  const handleDateSelect = (date: Date) => {
    if (!session) {
      toast({
        title: "Giriş Gerekli",
        description: "Ders eklemek için lütfen giriş yapın.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    setSelectedDate(date);
    setSelectedLesson(undefined);
    setIsDialogOpen(true);
  };

  const handleLessonClick = (lesson: CalendarEvent) => {
    if (!session) {
      toast({
        title: "Giriş Gerekli",
        description: "Dersleri düzenlemek için lütfen giriş yapın.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    setSelectedLesson(lesson);
    setSelectedDate(lesson.start);
    setIsDialogOpen(true);
  };

  const handleSaveLesson = (lessonData: Omit<CalendarEvent, "id">) => {
    if (!session) {
      toast({
        title: "Giriş Gerekli",
        description: "Ders kaydetmek için lütfen giriş yapın.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    const lessonToSave = selectedLesson
      ? { ...lessonData, id: selectedLesson.id }
      : { ...lessonData, id: crypto.randomUUID() };
      
    saveLesson(lessonToSave);
    setIsDialogOpen(false);
    setSelectedLesson(undefined);
  };

  const handleDeleteLesson = (lessonId: string) => {
    if (!session) {
      toast({
        title: "Giriş Gerekli",
        description: "Ders silmek için lütfen giriş yapın.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    deleteLesson(lessonId);
    setIsDialogOpen(false);
    setSelectedLesson(undefined);
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    if (!session) {
      toast({
        title: "Giriş Gerekli",
        description: "Dersleri düzenlemek için lütfen giriş yapın.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    saveLesson(updatedEvent);
  };

  const { handleNavigationClick, handleTodayClick } = useCalendarNavigation(selectedDate, setSelectedDate);

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <PageHeader title="Takvim">
        <div className="flex items-center gap-1 md:gap-2">
          {session && (
            <>
              <WeeklySchedulePdf lessons={lessons} students={students} />
              <Button 
                size="sm"
                onClick={() => {
                  if (!session) {
                    toast({
                      title: "Giriş Gerekli",
                      description: "Ders eklemek için lütfen giriş yapın.",
                      variant: "destructive"
                    });
                    navigate('/login');
                    return;
                  }
                  setSelectedLesson(undefined);
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-1 md:mr-2" />
                <span className="hidden md:inline">Ders Ekle</span>
                <span className="md:hidden">Ekle</span>
              </Button>
            </>
          )}
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
      
      {session && (
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
      )}
    </div>
  );
}