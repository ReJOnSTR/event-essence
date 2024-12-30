import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import StudentList from "@/components/Students/StudentList";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Student } from "@/types/calendar";

interface SettingsProps {
  students: Student[];
  onAddStudent: () => void;
  onStudentClick: (student: Student) => void;
}

export default function Settings({ students, onAddStudent, onStudentClick }: SettingsProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gray-50 font-sans">
        <Sidebar>
          <SidebarContent className="p-4">
            <StudentList
              students={students}
              onAddStudent={onAddStudent}
              onStudentClick={onStudentClick}
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
            <h1 className="text-2xl font-semibold text-gray-900">Ayarlar</h1>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            {/* Settings content will go here */}
            <div className="grid gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Genel Ayarlar</h2>
                {/* Add settings content here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}