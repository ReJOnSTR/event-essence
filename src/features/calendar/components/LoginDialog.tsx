import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface LoginDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginDialog({ isOpen, onOpenChange }: LoginDialogProps) {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
  );
}