import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchResults } from "./SearchResults";
import { CalendarEvent, Student } from "@/types/calendar";

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  filteredLessons: CalendarEvent[];
  filteredStudents: Student[];
  students: Student[];
  onSelectDate: (date: Date) => void;
  onStudentClick: (student: Student) => void;
}

export function SearchPanel({
  isOpen,
  onClose,
  searchTerm,
  filteredLessons,
  filteredStudents,
  students,
  onSelectDate,
  onStudentClick,
}: SearchPanelProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[400px] p-0">
        <ScrollArea className="h-full px-4">
          <div className="py-6">
            <h2 className="text-lg font-semibold mb-4">Arama Sonuçları</h2>
            <SearchResults
              searchTerm={searchTerm}
              filteredLessons={filteredLessons}
              filteredStudents={filteredStudents}
              students={students}
              onSelectDate={onSelectDate}
              onStudentClick={onStudentClick}
              onClose={onClose}
            />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}