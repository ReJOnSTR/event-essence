import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { Student } from "@/types/calendar";
import StudentList from "@/components/Students/StudentList";

interface ReportsProps {
  students: Student[];
  onAddStudent: () => void;
  onStudentClick: (student: Student) => void;
}

export default function Reports({ students, onAddStudent, onStudentClick }: ReportsProps) {
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
            <h1 className="text-2xl font-semibold text-gray-900">Raporlar</h1>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-semibold mb-4">Toplam Ders Saati</h2>
                <p className="text-3xl font-bold text-blue-600">0</p>
                <p className="text-sm text-gray-500 mt-1">Bu ay</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-semibold mb-4">Aktif Öğrenciler</h2>
                <p className="text-3xl font-bold text-green-600">{students.length}</p>
                <p className="text-sm text-gray-500 mt-1">Toplam</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-semibold mb-4">Toplam Gelir</h2>
                <p className="text-3xl font-bold text-purple-600">₺0</p>
                <p className="text-sm text-gray-500 mt-1">Bu ay</p>
              </div>
            </div>
            
            <div className="mt-8 bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Ders İstatistikleri</h2>
                <div className="text-center text-gray-500 py-8">
                  Henüz ders verisi bulunmamaktadır.
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Öğrenci Performansı</h2>
                <div className="text-center text-gray-500 py-8">
                  Henüz performans verisi bulunmamaktadır.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}