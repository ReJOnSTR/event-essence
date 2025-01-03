import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Student, Lesson } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import SideMenu from "@/components/Layout/SideMenu";
import { ReportFilters } from "@/components/Reports/ReportFilters";
import { StatsCards } from "@/components/Reports/StatsCards";
import { LessonList } from "@/components/Reports/LessonList";
import { calculatePeriodHours, calculatePeriodEarnings } from "@/utils/reportCalculations";
import StudentDialog from "@/components/Students/StudentDialog";
import { useStudents } from "@/hooks/useStudents";
import { useToast } from "@/components/ui/use-toast";

export default function Reports() {
  const [selectedStudent, setSelectedStudent] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<"weekly" | "monthly" | "yearly">("weekly");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>();
  const [studentName, setStudentName] = useState("");
  const [studentPrice, setStudentPrice] = useState(0);
  const [studentColor, setStudentColor] = useState("#1a73e8");

  const { students, saveStudent, deleteStudent } = useStudents();
  const { toast } = useToast();

  const handleOpenDialog = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setStudentName(student.name);
      setStudentPrice(student.price);
      setStudentColor(student.color);
    } else {
      setEditingStudent(undefined);
      setStudentName("");
      setStudentPrice(0);
      setStudentColor("#1a73e8");
    }
    setIsStudentDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsStudentDialogOpen(false);
    setEditingStudent(undefined);
    setStudentName("");
    setStudentPrice(0);
    setStudentColor("#1a73e8");
  };

  const handleSaveStudent = () => {
    const studentData = {
      id: editingStudent?.id || crypto.randomUUID(),
      name: studentName,
      price: studentPrice,
      color: studentColor,
    };

    saveStudent(studentData);
    
    toast({
      title: editingStudent ? "Öğrenci güncellendi" : "Öğrenci eklendi",
      description: editingStudent 
        ? "Öğrenci bilgileri başarıyla güncellendi."
        : "Yeni öğrenci başarıyla eklendi.",
    });

    handleCloseDialog();
  };

  const handleDeleteStudent = () => {
    if (editingStudent) {
      deleteStudent(editingStudent.id);
      toast({
        title: "Öğrenci silindi",
        description: "Öğrenci başarıyla silindi.",
      });
      handleCloseDialog();
    }
  };

  const lessons = (() => {
    const savedLessons = localStorage.getItem('lessons');
    return savedLessons ? JSON.parse(savedLessons) : [];
  })();

  const hours = calculatePeriodHours(lessons, selectedDate, selectedStudent);
  const earnings = calculatePeriodEarnings(lessons, selectedDate, selectedStudent, students);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gray-50 font-sans">
        <Sidebar>
          <SidebarContent className="p-4">
            <SideMenu
              onEdit={handleOpenDialog}
              onAddStudent={() => handleOpenDialog()}
            />
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <div className="flex items-center gap-4 p-4 border-b bg-white">
            <SidebarTrigger />
            <Link 
              to="/" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Takvime Dön</span>
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900">Raporlar</h1>
          </div>

          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-4">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Filtreler</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReportFilters
                    selectedStudent={selectedStudent}
                    setSelectedStudent={setSelectedStudent}
                    selectedPeriod={selectedPeriod}
                    setSelectedPeriod={setSelectedPeriod}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    students={students}
                  />
                </CardContent>
              </Card>

              <StatsCards 
                hours={hours} 
                earnings={earnings}
                selectedDate={selectedDate} 
              />

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Ders Listesi</CardTitle>
                </CardHeader>
                <CardContent>
                  <LessonList
                    lessons={lessons}
                    students={students}
                    selectedStudent={selectedStudent}
                    selectedPeriod={selectedPeriod}
                    selectedDate={selectedDate}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <StudentDialog
          isOpen={isStudentDialogOpen}
          onClose={handleCloseDialog}
          onSave={handleSaveStudent}
          onDelete={handleDeleteStudent}
          student={editingStudent}
          studentName={studentName}
          setStudentName={setStudentName}
          studentPrice={studentPrice}
          setStudentPrice={setStudentPrice}
          studentColor={studentColor}
          setStudentColor={setStudentColor}
        />
      </div>
    </SidebarProvider>
  );
}