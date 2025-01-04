import { useNavigate } from "react-router-dom";
import { LogIn, LogOut, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function AuthButtons() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Başarıyla çıkış yapıldı",
        duration: 2000,
      });
      navigate("/auth");
    } catch (error) {
      toast({
        title: "Çıkış yapılırken bir hata oluştu",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleLogout}
        className="hover:bg-secondary"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function LoginButton() {
  const navigate = useNavigate();
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => navigate("/auth")}
      className="w-full justify-start gap-2"
    >
      <LogIn className="h-4 w-4" />
      <span>Giriş Yap</span>
    </Button>
  );
}