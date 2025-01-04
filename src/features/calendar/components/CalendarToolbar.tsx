import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { WeeklySchedulePdf } from "@/components/Calendar/WeeklySchedulePdf";
import { CalendarEvent, Student } from "@/types/calendar";

interface CalendarToolbarProps {
  onSearchClick: () => void;
  onAddLessonClick: () => void;
  lessons: CalendarEvent[];
  students: Student[];
}

export default function CalendarToolbar({
  onSearchClick,
  onAddLessonClick,
  lessons,
  students
}: CalendarToolbarProps) {
  return (
    <div className="ml-auto flex items-center gap-1 md:gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={onSearchClick}
      >
        <Search className="h-4 w-4" />
        <span className="hidden md:inline ml-2">Ara</span>
      </Button>
      <WeeklySchedulePdf lessons={lessons} students={students} />
      <Button 
        size="sm"
        onClick={onAddLessonClick}
      >
        <Plus className="h-4 w-4 mr-1 md:mr-2" />
        <span className="hidden md:inline">Ders Ekle</span>
        <span className="md:hidden">Ekle</span>
      </Button>
    </div>
  );
}