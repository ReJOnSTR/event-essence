import { Student } from "@/types/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

interface StudentSearchResultsProps {
  students: Student[];
  onStudentClick: (student: Student) => void;
  searchQuery: string;
}

export function StudentSearchResults({ 
  students, 
  onStudentClick,
  searchQuery 
}: StudentSearchResultsProps) {
  if (!searchQuery) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Arama Sonuçları</h2>
        <p className="text-sm text-muted-foreground">
          {students.length} öğrenci bulundu
        </p>
      </div>
      
      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-2">
          {students.map((student) => (
            <Card
              key={student.id}
              className="p-4 cursor-pointer hover:bg-secondary transition-colors"
              onClick={() => onStudentClick(student)}
            >
              <div className="flex items-center space-x-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: student.color }}
                >
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium">{student.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {student.price.toLocaleString('tr-TR', { 
                      style: 'currency', 
                      currency: 'TRY' 
                    })}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}