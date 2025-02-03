import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useSessionContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (session && !isLoading) {
      const returnUrl = localStorage.getItem('returnUrl') || '/calendar';
      localStorage.removeItem('returnUrl');
      navigate(returnUrl, { replace: true });
    }
  }, [session, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return !session ? <>{children}</> : null;
}