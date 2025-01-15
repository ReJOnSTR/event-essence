import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { LoginForm } from "@/components/Auth/LoginForm";
import { RegisterForm } from "@/components/Auth/RegisterForm";
import { useToast } from "@/components/ui/use-toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoginView, setIsLoginView] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const returnUrl = localStorage.getItem('returnUrl') || '/calendar';
        localStorage.removeItem('returnUrl');
        
        toast({
          title: "Giriş başarılı",
          description: "Yönlendiriliyorsunuz...",
          duration: 2000,
        });
        
        navigate(returnUrl, { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <CalendarDays className="h-10 w-10 text-primary" />
            <CardTitle className="text-3xl font-bold text-primary">Ders Takvimi</CardTitle>
          </div>
          <CardDescription className="text-center text-lg">
            {isLoginView ? "Hesabınıza giriş yapın" : "Öğretmen hesabı oluşturun"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoginView ? (
            <LoginForm onToggleForm={() => setIsLoginView(false)} />
          ) : (
            <RegisterForm onToggleForm={() => setIsLoginView(true)} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}