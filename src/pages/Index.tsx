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
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { addWeeks, subWeeks, addMonths, subMonths, addYears, subYears } from "date-fns";

type ViewType = "day" | "week" | "month" | "year";

interface IndexProps {
  students: Student[];
  onAddStudent: () => void;
  onEditStudent: (student: Student) => void;
}

export default function Index({ students, onAddStudent, onEditStudent }: IndexProps) {
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const savedLessons = localStorage.getItem('lessons');
    return savedLessons ? JSON.parse(savedLessons) : [];
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<ViewType>("month");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | undefined>();
  const { toast } = useToast();

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

  const renderView = () => {
    const viewProps = {
      date: selectedDate,
      events: lessons,
      onDateSelect: handleDateSelect,
      onEventClick: handleLessonClick,
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
              onEdit={onEditStudent}
              onAddStudent={onAddStudent}
            />
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <div className="flex items-center gap-4 p-4 border-b bg-white">
            <SidebarTrigger />
            <h1 className="text-2xl font-semibold text-gray-900">Özel Ders Takip</h1>
            <div className="ml-auto">
              <Button onClick={onAddStudent}>
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
        </div>
      </div>
    </SidebarProvider>
  );
}
