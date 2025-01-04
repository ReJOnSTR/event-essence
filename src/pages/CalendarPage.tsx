import React, { useState } from "react";
import { useCalendarStore, ViewType } from "@/store/calendarStore";
import { useStudents } from "@/hooks/useStudents";
import { useToast } from "@/components/ui/use-toast";
import { CalendarEvent } from "@/types/calendar";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import CalendarPageHeader from "@/components/Calendar/CalendarPageHeader";
import SideMenu from "@/components/Layout/SideMenu";
import CalendarContent from "@/features/calendar/components/CalendarContent";
import { useCalendarNavigation } from "@/features/calendar/hooks/useCalendarNavigation";
import CalendarToolbar from "@/features/calendar/components/CalendarToolbar";
import CalendarDialogs from "@/features/calendar/components/CalendarDialogs";

export default function CalendarPage() {
  const [lessons, setLessons] = useState<CalendarEvent[]>(() => {
    const savedLessons = localStorage.getItem('lessons');
    return savedLessons ? JSON.parse(savedLessons) : [];
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedLesson, setSelectedLesson] = useState<CalendarEvent | undefined>();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const { currentView, setCurrentView } = useCalendarStore();
  const { students, saveStudent, deleteStudent } = useStudents();
  const { toast } = useToast();
  const { handleNavigationClick, handleTodayClick } = useCalendarNavigation(selectedDate, setSelectedDate);

  const [studentDialogState, setStudentDialogState] = useState({
    selectedStudent: undefined,
    studentName: "",
    studentPrice: 0,
    studentColor: "#1a73e8"
  });

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedLesson(undefined);
    setIsDialogOpen(true);
  };

  const handleLessonClick = (lesson: CalendarEvent) => {
    setSelectedLesson(lesson);
    setSelectedDate(lesson.start);
    setIsDialogOpen(true);
  };

  const handleSaveLesson = (lessonData: Omit<CalendarEvent, "id">) => {
    if (selectedLesson) {
      const updatedLessons = lessons.map(lesson => 
        lesson.id === selectedLesson.id 
          ? { ...lessonData, id: lesson.id }
          : lesson
      );
      setLessons(updatedLessons);
      toast({
        title: "Ders güncellendi",
        description: "Dersiniz başarıyla güncellendi.",
      });
    } else {
      const newLesson: CalendarEvent = {
        ...lessonData,
        id: crypto.randomUUID(),
      };
      setLessons([...lessons, newLesson]);
      toast({
        title: "Ders oluşturuldu",
        description: "Dersiniz başarıyla oluşturuldu.",
      });
    }
  };

  const handleDeleteLesson = (lessonId: string) => {
    setLessons(lessons.filter(lesson => lesson.id !== lessonId));
    toast({
      title: "Ders silindi",
      description: "Dersiniz başarıyla silindi.",
    });
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    const updatedLessons = lessons.map(lesson =>
      lesson.id === updatedEvent.id ? updatedEvent : lesson
    );
    setLessons(updatedLessons);
  };

  React.useEffect(() => {
    localStorage.setItem('lessons', JSON.stringify(lessons));
  }, [lessons]);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background font-sans">
        <Sidebar>
          <SidebarContent className="p-4">
            <SideMenu
              onEdit={(student) => {
                setStudentDialogState({
                  selectedStudent: student,
                  studentName: student.name,
                  studentPrice: student.price,
                  studentColor: student.color || "#1a73e8"
                });
                setIsStudentDialogOpen(true);
              }}
              onAddStudent={() => setIsStudentDialogOpen(true)}
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
              onAddLessonClick={() => {
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
            onSaveLesson={handleSaveLesson}
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
                const updatedLessons = lessons.map(lesson => 
                  lesson.studentId === studentDialogState.selectedStudent.id 
                    ? { ...lesson, studentId: undefined }
                    : lesson
                );
                setLessons(updatedLessons);
                setIsStudentDialogOpen(false);
              }
            }}
            setStudentName={(name) => setStudentDialogState(prev => ({ ...prev, studentName: name }))}
            setStudentPrice={(price) => setStudentDialogState(prev => ({ ...prev, studentPrice: price }))}
            setStudentColor={(color) => setStudentDialogState(prev => ({ ...prev, studentColor: color }))}
            setSelectedDate={setSelectedDate}
            setCurrentView={setCurrentView}
          />
        </div>
      </div>
    </SidebarProvider>
  );
}