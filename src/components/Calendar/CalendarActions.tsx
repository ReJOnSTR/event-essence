import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { WeeklySchedulePdf } from "@/components/Calendar/WeeklySchedulePdf";
import { CalendarEvent, Student } from "@/types/calendar";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LogIn } from "lucide-react";

interface CalendarActionsProps {
  lessons: CalendarEvent[];
  students: Student[];
  onAddLesson: () => void;
}

export const CalendarActions = ({ lessons, students, onAddLesson }: CalendarActionsProps) => {
  const session = useSession();
  const { toast } = useToast();

  const handleAddLesson = () => {
    if (!session) {
      toast({
        title: "Giriş Yapmanız Gerekiyor",
        description: "Ders eklemek için lütfen giriş yapın.",
        variant: "destructive",
      });
      return;
    }
    onAddLesson();
  };

  return (
    <div className="flex items-center gap-1 md:gap-2">
      <WeeklySchedulePdf lessons={lessons} students={students} />
      {session ? (
        <Button size="sm" onClick={handleAddLesson}>
          <Plus className="h-4 w-4 mr-1 md:mr-2" />
          <span className="hidden md:inline">Ders Ekle</span>
          <span className="md:hidden">Ekle</span>
        </Button>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <LogIn className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Giriş Yap</span>
              <span className="md:hidden">Giriş</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Giriş Yapmanız Gerekiyor</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Ders eklemek ve takvimi düzenlemek için lütfen giriş yapın.
            </p>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};