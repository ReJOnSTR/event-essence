import { useState } from "react";
import MonthView from "@/components/Calendar/MonthView";
import DayView from "@/components/Calendar/DayView";
import WeekView from "@/components/Calendar/WeekView";
import YearView from "@/components/Calendar/YearView";
import LessonDialog from "@/components/Calendar/LessonDialog";
import { Lesson, Student } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { Plus, Users, Pencil, Trash2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type ViewType = "day" | "week" | "month" | "year";

export default function Index() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<ViewType>("month");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | undefined>();
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>();
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
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

  const handleSaveStudent = () => {
    if (selectedStudent) {
      // Update existing student
      const updatedStudents = students.map(student =>
        student.id === selectedStudent.id
          ? {
              ...student,
              name: studentName,
              email: studentEmail,
              phone: studentPhone,
            }
          : student
      );
      setStudents(updatedStudents);
      toast({
        title: "Öğrenci güncellendi",
        description: "Öğrenci bilgileri başarıyla güncellendi.",
      });
    } else {
      // Add new student
      const newStudent: Student = {
        id: crypto.randomUUID(),
        name: studentName,
        email: studentEmail,
        phone: studentPhone,
      };
      setStudents([...students, newStudent]);
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
    setIsStudentDialogOpen(true);
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents(students.filter(student => student.id !== studentId));
    // Also remove student from lessons
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
                    setIsStudentDialogOpen(true);
                    setSelectedStudent(undefined);
                  }}>
                    <Plus className="h-4 w-4" />
                    <span>Öğrenci Ekle</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {students.map((student) => (
                  <SidebarMenuItem key={student.id}>
                    <SidebarMenuButton className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{student.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditStudent(student)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteStudent(student.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col overflow-hidden">
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
          
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-auto">
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

          <Dialog open={isStudentDialogOpen} onOpenChange={handleCloseStudentDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedStudent ? "Öğrenci Düzenle" : "Öğrenci Ekle"}
                </DialogTitle>
                <DialogDescription>
                  Öğrenci bilgilerini buradan ekleyebilir veya düzenleyebilirsiniz.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">İsim</label>
                  <Input
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Öğrenci adı"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">E-posta</label>
                  <Input
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="ornek@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Telefon</label>
                  <Input
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    placeholder="05XX XXX XX XX"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseStudentDialog}>
                  İptal
                </Button>
                <Button onClick={handleSaveStudent}>
                  {selectedStudent ? "Güncelle" : "Ekle"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </SidebarProvider>
  );
}
