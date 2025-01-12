import React from "react";
import { useCalendarStore } from "@/store/calendarStore";
import { useToast } from "@/hooks/use-toast";
import { CalendarEvent } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { Plus, LogIn } from "lucide-react";
import CalendarPageHeader from "@/components/Calendar/CalendarPageHeader";
import LessonDialog from "@/components/Calendar/LessonDialog";
import StudentDialog from "@/components/Students/StudentDialog";
import { WeeklySchedulePdf } from "@/components/Calendar/WeeklySchedulePdf";
import CalendarContent from "@/features/calendar/components/CalendarContent";
import { useCalendarNavigation } from "@/features/calendar/hooks/useCalendarNavigation";
import { useCalendarEvents } from "@/features/calendar/hooks/useCalendarEvents";
import { PageHeader } from "@/components/Layout/PageHeader";
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useNavigate } from "react-router-dom";
import { useStudentDialog } from "@/features/students/hooks/useStudentDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface CalendarPageProps {
  headerHeight: number;
}

export default function CalendarPage({ headerHeight }: CalendarPageProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [selectedLesson, setSelectedLesson] = React.useState<CalendarEvent | undefined>();
  
  const { currentView, setCurrentView } = useCalendarStore();
  const { events, students, isLoading, handleEventUpdate, handleEventDelete } = useCalendarEvents();
  const { toast } = useToast();
  const { handleNavigationClick, handleTodayClick } = useCalendarNavigation(selectedDate, setSelectedDate);
  const { session } = useSessionContext();
  const navigate = useNavigate();
  const studentDialog = useStudentDialog();

  const handleDateSelect = (date: Date) => {
    if (!session) {
      setIsLoginDialogOpen(true);
      return;
    }
    setSelectedDate(date);
    setSelectedLesson(undefined);
    setIsDialogOpen(true);
  };

  const handleLessonClick = (lesson: CalendarEvent) => {
    if (!session) {
      setIsLoginDialogOpen(true);
      return;
    }
    setSelectedLesson(lesson);
    setSelectedDate(lesson.start);
    setIsDialogOpen(true);
  };

  const handleLoginClick = () => {
    navigate('/login');
    setIsLoginDialogOpen(false);
  };

  const handleSaveLesson = (lessonData: Omit<CalendarEvent, "id">) => {
    if (!session) return;
    
    const lessonToSave = selectedLesson
      ? { ...lessonData, id: selectedLesson.id }
      : { ...lessonData, id: crypto.randomUUID() };
      
    handleEventUpdate(lessonToSave);
    setIsDialogOpen(false);
    setSelectedLesson(undefined);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <PageHeader title="Takvim">
        <div className="flex items-center gap-1 md:gap-2">
          {session && (
            <>
              <WeeklySchedulePdf lessons={events} students={students} />
              <Button 
                size="sm"
                onClick={() => {
                  if (!session) {
                    setIsLoginDialogOpen(true);
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
        onViewChange={setCurrentView}
        onPrevious={handleNavigationClick('prev', currentView)}
        onNext={handleNavigationClick('next', currentView)}
        onToday={handleTodayClick}
      />
      
      <CalendarContent
        currentView={currentView}
        selectedDate={selectedDate}
        events={events}
        onDateSelect={handleDateSelect}
        onEventClick={handleLessonClick}
        onEventUpdate={handleEventUpdate}
        students={students}
        isLoading={isLoading}
      />
      
      {session && (
        <>
          <LessonDialog
            isOpen={isDialogOpen}
            onClose={() => {
              setIsDialogOpen(false);
              setSelectedLesson(undefined);
            }}
            onSave={handleSaveLesson}
            onDelete={handleEventDelete}
            selectedDate={selectedDate}
            event={selectedLesson}
            events={events}
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

      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Giriş Yapmanız Gerekiyor</DialogTitle>
            <DialogDescription className="pt-2">
              Ders eklemek ve düzenlemek için lütfen giriş yapın. Giriş yaparak tüm özelliklere erişebilirsiniz.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button 
              onClick={handleLoginClick}
              className="w-full sm:w-auto"
              size="lg"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Giriş Yap
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}