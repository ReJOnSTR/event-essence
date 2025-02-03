import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useToast } from "@/components/ui/use-toast";

export function ProtectedRoute({ children, requireAuth = false }: { children: React.ReactNode, requireAuth?: boolean }) {
  const { session, isLoading } = useSessionContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!session && !isLoading && requireAuth) {
      localStorage.setItem('returnUrl', location.pathname);
      navigate('/login', { replace: true });
      toast({
        title: "Oturum açmanız gerekiyor",
        description: "Bu işlemi gerçekleştirmek için lütfen giriş yapın.",
        variant: "destructive",
      });
    }
  }, [session, isLoading, navigate, location, toast, requireAuth]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}