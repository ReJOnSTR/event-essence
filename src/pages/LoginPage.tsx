import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const { session } = useSessionContext();
  const { toast } = useToast();

  useEffect(() => {
    if (session) {
      navigate("/calendar");
    }
  }, [session, navigate]);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/calendar`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('Google login error:', error);
        toast({
          title: "Giriş hatası",
          description: "Google ile giriş yapılırken bir hata oluştu.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Giriş hatası",
        description: "Bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            Hoş Geldiniz
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Devam etmek için giriş yapın
          </p>
        </div>

        <div className="mt-8">
          <Button
            onClick={handleGoogleLogin}
            className="w-full"
            size="lg"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Google ile Giriş Yap
          </Button>
        </div>
      </div>
    </div>
  );
}