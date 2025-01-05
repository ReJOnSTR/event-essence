import { Button } from "@/components/ui/button";
import { Plus, LogIn } from "lucide-react";
import { WeeklySchedulePdf } from "@/components/Calendar/WeeklySchedulePdf";
import { useSessionContext } from '@supabase/auth-helpers-react';
import { AddStudentButton } from "@/features/students/components/AddStudentButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface CalendarActionsProps {
  lessons: any[];
  students: any[];
  onAddLesson: () => void;
}

export function CalendarActions({ lessons, students, onAddLesson }: CalendarActionsProps) {
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const { session } = useSessionContext();
  const navigate = useNavigate();

  const handleAddLesson = () => {
    if (!session) {
      setIsLoginDialogOpen(true);
      return;
    }
    onAddLesson();
  };

  const handleLoginClick = () => {
    navigate('/login');
    setIsLoginDialogOpen(false);
  };

  return (
    <div className="flex items-center gap-1 md:gap-2">
      {session && (
        <>
          <WeeklySchedulePdf lessons={lessons} students={students} />
          <Button 
            size="sm"
            onClick={handleAddLesson}
          >
            <Plus className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden md:inline">Ders Ekle</span>
            <span className="md:hidden">Ekle</span>
          </Button>
          <AddStudentButton />
        </>
      )}

      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Giriş Yapmanız Gerekiyor</DialogTitle>
            <DialogDescription className="pt-2">
              Ders eklemek ve düzenlemek için lütfen giriş yapın. Giriş yaparak tüm özelliklere erişebilirsiniz.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button 
              onClick={handleLoginClick}
              className="w-full sm:w-auto"
              size="lg"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Giriş Yap
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}