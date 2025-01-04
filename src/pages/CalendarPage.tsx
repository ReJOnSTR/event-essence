import React, { useState } from "react";
import { useCalendarStore, ViewType } from "@/store/calendarStore";
import { useStudents } from "@/hooks/useStudents";
import { useToast } from "@/components/ui/use-toast";
import { CalendarEvent } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import CalendarPageHeader from "@/components/Calendar/CalendarPageHeader";
import LessonDialog from "@/components/Calendar/LessonDialog";
import StudentDialog from "@/components/Students/StudentDialog";
import SearchDialog from "@/components/Calendar/SearchDialog";
import SideMenu from "@/components/Layout/SideMenu";
import { WeeklySchedulePdf } from "@/components/Calendar/WeeklySchedulePdf";
import CalendarContent from "@/features/calendar/components/CalendarContent";
import { useCalendarNavigation } from "@/features/calendar/hooks/useCalendarNavigation";

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

  // Student dialog state
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

  // Save lessons to localStorage
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
            <div className="ml-auto flex items-center gap-1 md:gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
                <span className="hidden md:inline ml-2">Ara</span>
              </Button>
              <WeeklySchedulePdf lessons={lessons} students={students} />
              <Button 
                size="sm"
                onClick={() => {
                  setSelectedLesson(undefined);
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-1 md:mr-2" />
                <span className="hidden md:inline">Ders Ekle</span>
                <span className="md:hidden">Ekle</span>
              </Button>
            </div>
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
            isOpen={isStudentDialogOpen}
            onClose={() => {
              setIsStudentDialogOpen(false);
              setStudentDialogState({
                selectedStudent: undefined,
                studentName: "",
                studentPrice: 0,
                studentColor: "#1a73e8"
              });
            }}
            onSave={() => {
              const { selectedStudent, studentName, studentPrice, studentColor } = studentDialogState;
              saveStudent({
                id: selectedStudent?.id || crypto.randomUUID(),
                name: studentName,
                price: studentPrice,
                color: studentColor,
              });
              toast({
                title: selectedStudent ? "Öğrenci güncellendi" : "Öğrenci eklendi",
                description: selectedStudent 
                  ? "Öğrenci bilgileri başarıyla güncellendi."
                  : "Yeni öğrenci başarıyla eklendi.",
              });
              setIsStudentDialogOpen(false);
            }}
            onDelete={() => {
              const { selectedStudent } = studentDialogState;
              if (selectedStudent) {
                deleteStudent(selectedStudent.id);
                const updatedLessons = lessons.map(lesson => 
                  lesson.studentId === selectedStudent.id 
                    ? { ...lesson, studentId: undefined }
                    : lesson
                );
                setLessons(updatedLessons);
                toast({
                  title: "Öğrenci silindi",
                  description: "Öğrenci başarıyla silindi.",
                });
                setIsStudentDialogOpen(false);
              }
            }}
            student={studentDialogState.selectedStudent}
            studentName={studentDialogState.studentName}
            setStudentName={(name) => setStudentDialogState(prev => ({ ...prev, studentName: name }))}
            studentPrice={studentDialogState.studentPrice}
            setStudentPrice={(price) => setStudentDialogState(prev => ({ ...prev, studentPrice: price }))}
            studentColor={studentDialogState.studentColor}
            setStudentColor={(color) => setStudentDialogState(prev => ({ ...prev, studentColor: color }))}
          />

          <SearchDialog
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onSelectDate={(date) => {
              setSelectedDate(date);
              setCurrentView('day');
            }}
            lessons={lessons}
            students={students}
          />
        </div>
      </div>
    </SidebarProvider>
  );
}