import { Toaster } from "@/components/ui/toaster";
import { useState, useEffect } from "react";
import MonthView from "@/components/Calendar/MonthView";
import DayView from "@/components/Calendar/DayView";
import WeekView from "@/components/Calendar/WeekView";
import YearView from "@/components/Calendar/YearView";
import LessonDialog from "@/components/Calendar/LessonDialog";
import StudentList from "@/components/Students/StudentList";
import StudentDialog from "@/components/Students/StudentDialog";
import CalendarPageHeader from "@/components/Calendar/CalendarPageHeader";
import { Lesson, Student } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { addWeeks, subWeeks, addMonths, subMonths, addYears, subYears } from "date-fns";

type ViewType = "day" | "week" | "month" | "year";

export default function Index() {
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const savedLessons = localStorage.getItem('lessons');
    return savedLessons ? JSON.parse(savedLessons) : [];
  });
  const [students, setStudents] = useState<Student[]>(() => {
    const savedStudents = localStorage.getItem('students');
    return savedStudents ? JSON.parse(savedStudents) : [];
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<ViewType>("month");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | undefined>();
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>();
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [studentColor, setStudentColor] = useState("#9b87f5");
  const { toast } = useToast();
  const navigate = useNavigate();

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
        setSelectedDate(prev => direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1));
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

  const handleSaveStudent = () => {
    if (selectedStudent) {
      const updatedStudents = students.map(student =>
        student.id === selectedStudent.id
          ? {
              ...student,
              name: studentName,
              email: studentEmail,
              phone: studentPhone,
              color: studentColor,
            }
          : student
      );
      setStudents(updatedStudents);
      localStorage.setItem('students', JSON.stringify(updatedStudents));
      toast({
        title: "Öğrenci güncellendi",
        description: "Öğrenci bilgileri başarıyla güncellendi.",
      });
    } else {
      const newStudent: Student = {
        id: crypto.randomUUID(),
        name: studentName,
        email: studentEmail,
        phone: studentPhone,
        color: studentColor,
      };
      const newStudents = [...students, newStudent];
      setStudents(newStudents);
      localStorage.setItem('students', JSON.stringify(newStudents));
      toast({
        title: "Öğrenci eklendi",
        description: "Yeni öğrenci başarıyla eklendi.",
      });
    }
    handleCloseStudentDialog();
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setStudentName(student.name);
    setStudentEmail(student.email || "");
    setStudentPhone(student.phone || "");
    setStudentColor(student.color || "#9b87f5");
    setIsStudentDialogOpen(true);
  };

  const handleDeleteStudent = (studentId: string) => {
    const updatedStudents = students.filter(student => student.id !== studentId);
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
    setLessons(lessons.map(lesson => 
      lesson.studentId === studentId 
        ? { ...lesson, studentId: undefined }
        : lesson
    ));
    toast({
      title: "Öğrenci silindi",
      description: "Öğrenci başarıyla silindi.",
    });
  };

  const handleCloseStudentDialog = () => {
    setIsStudentDialogOpen(false);
    setSelectedStudent(undefined);
    setStudentName("");
    setStudentEmail("");
    setStudentPhone("");
    setStudentColor("#9b87f5");
  };

  const handleLessonUpdate = (updatedLesson: Lesson) => {
    setLessons(prevLessons => 
      prevLessons.map(lesson => 
        lesson.id === updatedLesson.id ? updatedLesson : lesson
      )
    );
  };

  const handleStudentClick = (student: Student) => {
    navigate('/students');
    handleEditStudent(student);
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
            <StudentList
              students={students}
              onEdit={handleEditStudent}
              onDelete={handleDeleteStudent}
              onAddStudent={() => setIsStudentDialogOpen(true)}
              onStudentClick={handleStudentClick}
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
            student={selectedStudent}
            studentName={studentName}
            setStudentName={setStudentName}
            studentEmail={studentEmail}
            setStudentEmail={setStudentEmail}
            studentPhone={studentPhone}
            setStudentPhone={setStudentPhone}
            studentColor={studentColor}
            setStudentColor={setStudentColor}
          />
        </div>
      </div>
    </SidebarProvider>
  );
}
