import React, { useState, useEffect } from "react";
import { useCalendarStore, ViewType } from "@/store/calendarStore";
import { useStudents } from "@/hooks/useStudents";
import { CalendarEvent } from "@/types/calendar";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import CalendarPageHeader from "@/components/Calendar/CalendarPageHeader";
import SideMenu from "@/components/Layout/SideMenu";
import CalendarContent from "@/features/calendar/components/CalendarContent";
import { useCalendarNavigation } from "@/features/calendar/hooks/useCalendarNavigation";
import CalendarToolbar from "@/features/calendar/components/CalendarToolbar";
import CalendarDialogs from "@/features/calendar/components/CalendarDialogs";
import { useCalendarData } from "@/hooks/useCalendarData";
import AuthDialog from "@/components/Auth/AuthDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function CalendarPage() {
  const {
    lessons,
    handleSaveLesson,
    handleUpdateLesson,
    handleDeleteLesson
  } = useCalendarData();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedLesson, setSelectedLesson] = useState<CalendarEvent | undefined>();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState(supabase.auth.getUser());
  const { toast } = useToast();
  
  const { currentView, setCurrentView } = useCalendarStore();
  const { students, saveStudent, deleteStudent } = useStudents();
  const { handleNavigationClick, handleTodayClick } = useCalendarNavigation(selectedDate, setSelectedDate);

  const [studentDialogState, setStudentDialogState] = useState({
    selectedStudent: undefined,
    studentName: "",
    studentPrice: 0,
    studentColor: "#1a73e8"
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session);
        setIsAuthDialogOpen(false);
        toast({
          title: "Giriş başarılı",
          description: "Hoş geldiniz!"
        });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const handleDateSelect = async (date: Date) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsAuthDialogOpen(true);
      return;
    }
    setSelectedDate(date);
    setSelectedLesson(undefined);
    setIsDialogOpen(true);
  };

  const handleLessonClick = async (lesson: CalendarEvent) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsAuthDialogOpen(true);
      return;
    }
    setSelectedLesson(lesson);
    setSelectedDate(lesson.start);
    setIsDialogOpen(true);
  };

  const handleSaveLessonClick = async (lessonData: Omit<CalendarEvent, "id">) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsAuthDialogOpen(true);
      return;
    }
    
    if (selectedLesson) {
      handleUpdateLesson(selectedLesson.id, lessonData);
    } else {
      handleSaveLesson(lessonData);
    }
    setIsDialogOpen(false);
  };

  const handleEventUpdate = async (updatedEvent: CalendarEvent) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsAuthDialogOpen(true);
      return;
    }
    handleUpdateLesson(updatedEvent.id, updatedEvent);
  };

  const handleAddStudent = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsAuthDialogOpen(true);
      return;
    }
    setIsStudentDialogOpen(true);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background font-sans">
        <Sidebar>
          <SidebarContent className="p-4">
            <SideMenu
              onEdit={async (student) => {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                  setIsAuthDialogOpen(true);
                  return;
                }
                setStudentDialogState({
                  selectedStudent: student,
                  studentName: student.name,
                  studentPrice: student.price,
                  studentColor: student.color || "#1a73e8"
                });
                setIsStudentDialogOpen(true);
              }}
              onAddStudent={handleAddStudent}
            />
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <div className="flex items-center gap-2 md:gap-4 p-2 md:p-4 border-b bg-background">
            <SidebarTrigger />
            <h1 className="text-lg md:text-2xl font-semibold text-foreground truncate">
              Özel Ders Takip
            </h1>
            <CalendarToolbar
              onSearchClick={() => setIsSearchOpen(true)}
              onAddLessonClick={async () => {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                  setIsAuthDialogOpen(true);
                  return;
                }
                setSelectedLesson(undefined);
                setIsDialogOpen(true);
              }}
              lessons={lessons}
              students={students}
            />
          </div>

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
          
          <CalendarDialogs
            isDialogOpen={isDialogOpen}
            isStudentDialogOpen={isStudentDialogOpen}
            isSearchOpen={isSearchOpen}
            selectedDate={selectedDate}
            selectedLesson={selectedLesson}
            lessons={lessons}
            students={students}
            studentDialogState={studentDialogState}
            onCloseDialog={() => {
              setIsDialogOpen(false);
              setSelectedLesson(undefined);
            }}
            onCloseStudentDialog={() => {
              setIsStudentDialogOpen(false);
              setStudentDialogState({
                selectedStudent: undefined,
                studentName: "",
                studentPrice: 0,
                studentColor: "#1a73e8"
              });
            }}
            onCloseSearchDialog={() => setIsSearchOpen(false)}
            onSaveLesson={handleSaveLessonClick}
            onDeleteLesson={handleDeleteLesson}
            onSaveStudent={() => {
              saveStudent({
                id: studentDialogState.selectedStudent?.id || crypto.randomUUID(),
                name: studentDialogState.studentName,
                price: studentDialogState.studentPrice,
                color: studentDialogState.studentColor,
              });
              setIsStudentDialogOpen(false);
            }}
            onDeleteStudent={() => {
              if (studentDialogState.selectedStudent) {
                deleteStudent(studentDialogState.selectedStudent.id);
                setIsStudentDialogOpen(false);
              }
            }}
            setStudentName={(name) => setStudentDialogState(prev => ({ ...prev, studentName: name }))}
            setStudentPrice={(price) => setStudentDialogState(prev => ({ ...prev, studentPrice: price }))}
            setStudentColor={(color) => setStudentDialogState(prev => ({ ...prev, studentColor: color }))}
            setSelectedDate={setSelectedDate}
            setCurrentView={setCurrentView}
          />

          <AuthDialog 
            isOpen={isAuthDialogOpen}
            onClose={() => setIsAuthDialogOpen(false)}
          />
        </div>
      </div>
    </SidebarProvider>
  );
}