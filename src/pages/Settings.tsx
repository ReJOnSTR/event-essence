import { useState } from "react";
import { Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import LeftMenu from "@/components/Menu/LeftMenu";
import { Student } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";

export default function Settings() {
  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem('students');
    return savedStudents ? JSON.parse(savedStudents) : [];
  });
  const { toast } = useToast();

  const handleEditStudent = (student: Student) => {
    // Logic to edit student
  };

  const handleDeleteStudent = (studentId: string) => {
    const updatedStudents = students.filter(student => student.id !== studentId);
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
    toast({
      title: "Öğrenci silindi",
      description: "Öğrenci başarıyla silindi.",
    });
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gray-50 font-sans">
        <Sidebar>
          <SidebarContent className="p-4">
            <LeftMenu
              students={students}
              onEdit={handleEditStudent}
              onDelete={handleDeleteStudent}
              onAddStudent={() => {}}
            />
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <div className="flex items-center gap-4 p-4 border-b bg-white">
            <SidebarTrigger />
            <h1 className="text-2xl font-semibold text-gray-900">Ayarlar</h1>
          </div>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4">
              <div className="grid gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Genel Ayarlar</h2>
                  <div className="space-y-4">
                    {/* Add your settings content here */}
                    <p className="text-gray-600">Ayarlar içeriği buraya gelecek...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
