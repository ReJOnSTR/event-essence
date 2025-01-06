import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function AuthHeader() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        // If we get a session_not_found error, we can consider the user logged out
        if (error.message.includes('session_not_found')) {
          navigate('/login');
          return;
        }
        throw error;
      }
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Çıkış yapılamadı",
        description: "Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleLogout}
      className="gap-2"
    >
      <LogOut className="h-4 w-4" />
      Çıkış Yap
    </Button>
  );
}