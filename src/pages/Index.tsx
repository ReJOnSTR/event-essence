import { useState } from "react";
import MonthView from "@/components/Calendar/MonthView";
import DayView from "@/components/Calendar/DayView";
import WeekView from "@/components/Calendar/WeekView";
import YearView from "@/components/Calendar/YearView";
import LessonDialog from "@/components/Calendar/LessonDialog";
import { Lesson, Student } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";

type ViewType = "day" | "week" | "month" | "year";

export default function Index() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<ViewType>("month");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | undefined>();
  const { toast } = useToast();

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

  const handleLessonUpdate = (updatedLesson: Lesson) => {
    setLessons(lessons.map(lesson => 
      lesson.id === updatedLesson.id ? updatedLesson : lesson
    ));
    toast({
      title: "Ders güncellendi",
      description: "Ders başarıyla taşındı.",
    });
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
      onEventUpdate: handleLessonUpdate,
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
            <SidebarGroup>
              <SidebarGroupLabel>Öğrenciler</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => {
                    toast({
                      title: "Yakında",
                      description: "Öğrenci ekleme özelliği yakında eklenecek.",
                    });
                  }}>
                    <Users className="h-4 w-4" />
                    <span>Öğrenci Ekle</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b bg-white">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <h1 className="text-2xl font-semibold text-gray-900">Özel Ders Takip</h1>
              </div>
              <Button onClick={() => {
                setSelectedLesson(undefined);
                setIsDialogOpen(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Ders Ekle
              </Button>
            </div>

            <Tabs value={currentView} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="day" onClick={() => setCurrentView("day")}>
                  Günlük
                </TabsTrigger>
                <TabsTrigger value="week" onClick={() => setCurrentView("week")}>
                  Haftalık
                </TabsTrigger>
                <TabsTrigger value="month" onClick={() => setCurrentView("month")}>
                  Aylık
                </TabsTrigger>
                <TabsTrigger value="year" onClick={() => setCurrentView("year")}>
                  Yıllık
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-4">
              {renderView()}
            </div>
          </ScrollArea>
          
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
          />
        </div>
      </div>
    </SidebarProvider>
  );
}