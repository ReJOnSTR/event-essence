import { useState, useEffect } from "react";
import MonthView from "@/components/Calendar/MonthView";
import DayView from "@/components/Calendar/DayView";
import WeekView from "@/components/Calendar/WeekView";
import YearView from "@/components/Calendar/YearView";
import LessonDialog from "@/components/Calendar/LessonDialog";
import StudentDialog from "@/components/Students/StudentDialog";
import CalendarPageHeader from "@/components/Calendar/CalendarPageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { addDays, subDays, addWeeks, subWeeks, addMonths, subMonths, addYears, subYears } from "date-fns";
import { useStudents } from "@/hooks/useStudents";
import { useCalendarStore, type ViewType } from "@/store/calendarStore";
import SideMenu from "@/components/Layout/SideMenu";
import { CalendarEvent, Student } from "@/types/calendar";
import { WeeklySchedulePdf } from "@/components/Calendar/WeeklySchedulePdf";
import { differenceInMinutes } from "date-fns";

export default function CalendarPage() {
  const [lessons, setLessons] = useState<CalendarEvent[]>(() => {
    const savedLessons = localStorage.getItem('lessons');
    return savedLessons ? JSON.parse(savedLessons) : [];
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { currentView, setCurrentView } = useCalendarStore();
  const [selectedLesson, setSelectedLesson] = useState<CalendarEvent | undefined>();
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>();
  const [studentName, setStudentName] = useState("");
  const [studentPrice, setStudentPrice] = useState(0);
  const [studentColor, setStudentColor] = useState("#1a73e8");
  const { toast } = useToast();
  const { students, saveStudent, deleteStudent } = useStudents();

  const [copiedLesson, setCopiedLesson] = useState<CalendarEvent | null>(null);

  // Dersleri localStorage'a kaydetme
  useEffect(() => {
    localStorage.setItem('lessons', JSON.stringify(lessons));
  }, [lessons]);

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

  const handleNavigationClick = (direction: 'prev' | 'next') => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    switch (currentView) {
      case 'day':
        setSelectedDate(prev => direction === 'next' ? addDays(prev, 1) : subDays(prev, 1));
        break;
      case 'week':
        setSelectedDate(prev => direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1));
        break;
      case 'month':
        setSelectedDate(prev => direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1));
        break;
      case 'year':
        setSelectedDate(prev => direction === 'next' ? addYears(prev, 1) : subYears(prev, 1));
        break;
    }
  };

  const handleTodayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedDate(new Date());
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

  const handleCopyLesson = (lesson: CalendarEvent) => {
    setCopiedLesson(lesson);
  };

  const handlePasteLesson = (date: Date) => {
    if (copiedLesson) {
      const duration = differenceInMinutes(copiedLesson.end, copiedLesson.start);
      const newStart = new Date(date);
      const newEnd = new Date(newStart.getTime() + duration * 60000);

      const newLesson: CalendarEvent = {
        ...copiedLesson,
        id: crypto.randomUUID(),
        start: newStart,
        end: newEnd,
      };

      setLessons([...lessons, newLesson]);
      toast({
        title: "Ders yapıştırıldı",
        description: "Ders başarıyla yapıştırıldı.",
      });
    }
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setStudentName(student.name);
    setStudentPrice(student.price);
    setStudentColor(student.color || "#1a73e8");
    setIsStudentDialogOpen(true);
  };

  const handleSaveStudent = () => {
    const studentData: Student = {
      id: selectedStudent?.id || crypto.randomUUID(),
      name: studentName,
      price: studentPrice,
      color: studentColor,
    };
    
    saveStudent(studentData);
    
    toast({
      title: selectedStudent ? "Öğrenci güncellendi" : "Öğrenci eklendi",
      description: selectedStudent 
        ? "Öğrenci bilgileri başarıyla güncellendi."
        : "Yeni öğrenci başarıyla eklendi.",
    });
    
    handleCloseStudentDialog();
  };

  const handleDeleteStudent = () => {
    if (selectedStudent) {
      deleteStudent(selectedStudent.id);
      
      // Update lessons to remove references to deleted student
      const updatedLessons = lessons.map(lesson => 
        lesson.studentId === selectedStudent.id 
          ? { ...lesson, studentId: undefined }
          : lesson
      );
      setLessons(updatedLessons);
      localStorage.setItem('lessons', JSON.stringify(updatedLessons));
      
      toast({
        title: "Öğrenci silindi",
        description: "Öğrenci başarıyla silindi.",
      });
      
      handleCloseStudentDialog();
    }
  };

  const handleCloseStudentDialog = () => {
    setIsStudentDialogOpen(false);
    setSelectedStudent(undefined);
    setStudentName("");
    setStudentPrice(0);
    setStudentColor("#1a73e8");
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    const updatedLessons = lessons.map(lesson =>
      lesson.id === updatedEvent.id ? updatedEvent : lesson
    );
    setLessons(updatedLessons);
  };

  const renderView = () => {
    const viewProps = {
      date: selectedDate,
      events: lessons,
      onDateSelect: handleDateSelect,
      onEventClick: handleLessonClick,
      onEventUpdate: handleEventUpdate,
      onEventCopy: handleCopyLesson,
      onEventPaste: () => handlePasteLesson(selectedDate),
      onEventDelete: handleDeleteLesson,
      canPaste: !!copiedLesson,
      students: students,
    };

    switch (currentView) {
      case "day":
        return <DayView {...viewProps} />;
      case "week":
        return <WeekView {...viewProps} />;
      case "year":
        return <YearView {...viewProps} />;
      default:
        return <MonthView {...viewProps} />;
    }
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full bg-gray-50 font-sans">
        <Sidebar>
          <SidebarContent className="p-4">
            <SideMenu
              onEdit={handleEditStudent}
              onAddStudent={() => setIsStudentDialogOpen(true)}
            />
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <div className="flex items-center gap-2 md:gap-4 p-2 md:p-4 border-b bg-white">
            <SidebarTrigger />
            <h1 className="text-lg md:text-2xl font-semibold text-gray-900 truncate">Özel Ders Takip</h1>
            <div className="ml-auto flex items-center gap-1 md:gap-2">
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
            onViewChange={(view) => setCurrentView(view as ViewType)}
            onPrevious={handleNavigationClick('prev')}
            onNext={handleNavigationClick('next')}
            onToday={handleTodayClick}
          />
          
          <div className="flex-1 overflow-auto">
            <div className="p-2 md:p-4">
              {renderView()}
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
            onClose={handleCloseStudentDialog}
            onSave={handleSaveStudent}
            onDelete={handleDeleteStudent}
            student={selectedStudent}
            studentName={studentName}
            setStudentName={setStudentName}
            studentPrice={studentPrice}
            setStudentPrice={setStudentPrice}
            studentColor={studentColor}
            setStudentColor={setStudentColor}
          />
        </div>
      </div>
    </SidebarProvider>
  );
}
