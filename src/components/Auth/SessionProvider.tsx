import { useEffect } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SessionProviderProps {
  children: React.ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const { session, isLoading } = useSessionContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Oturum değişikliklerini dinle
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (event === 'SIGNED_IN') {
        toast({
          title: "Başarılı",
          description: "Başarıyla giriş yaptınız.",
          duration: 3000,
        });
        navigate('/calendar');
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: "Çıkış yapıldı",
          description: "Oturumunuz sonlandırıldı.",
          duration: 3000,
        });
        navigate('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  useEffect(() => {
    if (!isLoading && !session && location.pathname !== '/') {
      toast({
        title: "Oturum gerekli",
        description: "Bu sayfayı görüntülemek için giriş yapmanız gerekiyor.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [session, isLoading, location.pathname, navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}