import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LoginRequiredDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginRequiredDialog({ isOpen, onClose }: LoginRequiredDialogProps) {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Giriş Yapmanız Gerekiyor</DialogTitle>
          <DialogDescription className="pt-2">
            Bu işlemi gerçekleştirmek için lütfen giriş yapın. Giriş yaparak tüm özelliklere erişebilirsiniz.
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