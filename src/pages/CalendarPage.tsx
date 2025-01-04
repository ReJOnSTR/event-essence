import React, { useState } from "react";
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
import { useAuth } from "@/hooks/useAuth";

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
  const { user, isAuthenticated } = useAuth();
  
  const { currentView, setCurrentView } = useCalendarStore();
  const { students, saveStudent, deleteStudent } = useStudents();
  const { handleNavigationClick, handleTodayClick } = useCalendarNavigation(selectedDate, setSelectedDate);

  const [studentDialogState, setStudentDialogState] = useState({
    selectedStudent: undefined,
    studentName: "",
    studentPrice: 0,
    studentColor: "#1a73e8"
  });

  const handleDateSelect = (date: Date) => {
    if (!isAuthenticated) {
      setIsAuthDialogOpen(true);
      return;
    }
    setSelectedDate(date);
    setSelectedLesson(undefined);
    setIsDialogOpen(true);
  };

  const handleLessonClick = (lesson: CalendarEvent) => {
    if (!isAuthenticated) {
      setIsAuthDialogOpen(true);
      return;
    }
    setSelectedLesson(lesson);
    setSelectedDate(lesson.start);
    setIsDialogOpen(true);
  };

  const handleSaveLessonClick = (lessonData: Omit<CalendarEvent, "id">) => {
    if (!isAuthenticated) {
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

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    if (!isAuthenticated) {
      setIsAuthDialogOpen(true);
      return;
    }
    handleUpdateLesson(updatedEvent.id, updatedEvent);
  };

  const handleAddStudent = () => {
    if (!isAuthenticated) {
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
              onEdit={(student) => {
                if (!isAuthenticated) {
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
              onAddLessonClick={() => {
                if (!isAuthenticated) {
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