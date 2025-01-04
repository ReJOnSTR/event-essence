import { useState } from "react";
import { Student } from "@/types/calendar";
import { Button } from "@/components/ui/button";
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
import { PdfReport } from "@/components/Reports/PdfReport";
import { BackButton } from "@/components/ui/back-button";

export default function Reports() {
  const [selectedStudent, setSelectedStudent] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<"weekly" | "monthly" | "yearly" | "custom">("weekly");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
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

  const hours = calculatePeriodHours(lessons, selectedDate, selectedStudent, startDate, endDate);
  const earnings = calculatePeriodEarnings(lessons, selectedDate, selectedStudent, students, startDate, endDate);

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
            <BackButton to="/" label="Takvime Dön" />
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
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    students={students}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-between items-center gap-4 flex-wrap">
                <StatsCards 
                  hours={hours} 
                  earnings={earnings}
                  selectedDate={selectedDate}
                  startDate={startDate}
                  endDate={endDate}
                  selectedPeriod={selectedPeriod}
                />
                <PdfReport
                  lessons={lessons}
                  students={students}
                  selectedStudent={selectedStudent}
                  selectedPeriod={selectedPeriod}
                  totalHours={hours[selectedPeriod as keyof typeof hours] || 0}
                  totalEarnings={earnings[selectedPeriod as keyof typeof earnings] || 0}
                  startDate={startDate}
                  endDate={endDate}
                />
              </div>

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
                    startDate={startDate}
                    endDate={endDate}
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