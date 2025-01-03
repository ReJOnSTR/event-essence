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
import { Lesson, Student } from "@/types/calendar";

export default function CalendarPage() {
  const [lessons, setLessons] = useState(() => {
    const savedLessons = localStorage.getItem('lessons');
    return savedLessons ? JSON.parse(savedLessons) : [];
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { currentView, setCurrentView } = useCalendarStore();
  const [selectedLesson, setSelectedLesson] = useState();
  const [selectedStudent, setSelectedStudent] = useState();
  const [studentName, setStudentName] = useState("");
  const [studentPrice, setStudentPrice] = useState(0);
  const [studentColor, setStudentColor] = useState("#1a73e8");
  const { toast } = useToast();
  const { students, saveStudent, deleteStudent } = useStudents();

  // Dersleri localStorage'a kaydetme
  useEffect(() => {
    localStorage.setItem('lessons', JSON.stringify(lessons));
  }, [lessons]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedLesson(undefined);
    setIsDialogOpen(true);
  };

  const handleLessonClick = (lesson: Lesson) => {
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

  const handleSaveLesson = (lessonData: Omit<Lesson, "id">) => {
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
      const newLesson: Lesson = {
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

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setStudentName(student.name);
    setStudentPrice(student.price);
    setStudentColor(student.color || "#1a73e8");
    setIsStudentDialogOpen(true);
  };

  const handleSaveStudent = () => {
    const studentData = {
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

  const renderView = () => {
    const viewProps = {
      date: selectedDate,
      events: lessons,
      onDateSelect: handleDateSelect,
      onEventClick: handleLessonClick,
      onEventUpdate: handleLessonUpdate,
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
    <SidebarProvider defaultOpen={true}>
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
          <div className="flex items-center gap-4 p-4 border-b bg-white">
            <SidebarTrigger />
            <h1 className="text-2xl font-semibold text-gray-900">Özel Ders Takip</h1>
            <div className="ml-auto">
              <Button onClick={() => {
                setSelectedLesson(undefined);
                setIsDialogOpen(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Ders Ekle
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
            <div className="p-4">
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
