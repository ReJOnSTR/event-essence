import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSessionContext } from '@supabase/auth-helpers-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

export function AddStudentButton() {
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const { session } = useSessionContext();
  const navigate = useNavigate();

  const handleAddStudent = () => {
    if (!session) {
      setIsLoginDialogOpen(true);
      return;
    }
    // If logged in, trigger the student dialog through the store
    window.dispatchEvent(new CustomEvent('openStudentDialog'));
  };

  const handleLoginClick = () => {
    navigate('/login');
    setIsLoginDialogOpen(false);
  };

  return (
    <>
      <Button 
        size="sm"
        onClick={handleAddStudent}
        className="gap-1"
      >
        <Plus className="h-4 w-4" />
        <span className="hidden md:inline">Öğrenci Ekle</span>
        <span className="md:hidden">Ekle</span>
      </Button>

      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Giriş Yapmanız Gerekiyor</DialogTitle>
            <DialogDescription className="pt-2">
              Öğrenci eklemek ve düzenlemek için lütfen giriş yapın. Giriş yaparak tüm özelliklere erişebilirsiniz.
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
    </>
  );
}