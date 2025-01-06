import { Button } from "@/components/ui/button";
import { Plus, LogIn } from "lucide-react";
import { WeeklySchedulePdf } from "@/components/Calendar/WeeklySchedulePdf";
import { CalendarEvent, Student } from "@/types/calendar";

interface CalendarHeaderProps {
  session: any;
  setIsLoginDialogOpen: (open: boolean) => void;
  setSelectedLesson: (lesson: CalendarEvent | undefined) => void;
  setIsDialogOpen: (open: boolean) => void;
  lessons: CalendarEvent[];
  students: Student[];
}

export default function CalendarHeader({
  session,
  setIsLoginDialogOpen,
  setSelectedLesson,
  setIsDialogOpen,
  lessons,
  students
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center gap-1 md:gap-2">
      {session && (
        <>
          <WeeklySchedulePdf lessons={lessons} students={students} />
          <Button 
            size="sm"
            onClick={() => {
              if (!session) {
                setIsLoginDialogOpen(true);
                return;
              }
              setSelectedLesson(undefined);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden md:inline">Ders Ekle</span>
            <span className="md:hidden">Ekle</span>
          </Button>
        </>
      )}
    </div>
  );
}