import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useToast } from "@/components/ui/use-toast";

export default function AuthPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === "SIGNED_IN") {
        toast({
          title: "Başarılı",
          description: "Giriş yapıldı",
        });
        navigate("/");
      } else if (event === "SIGNED_OUT") {
        navigate("/auth");
      } else if (event === "USER_UPDATED") {
        console.log("User updated:", session);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-4 rounded-lg border bg-card p-4 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Hoş Geldiniz
          </h1>
          <p className="text-sm text-muted-foreground">
            Devam etmek için giriş yapın veya kayıt olun
          </p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'rgb(var(--primary))',
                  brandAccent: 'rgb(var(--primary))',
                }
              }
            }
          }}
          localization={{
            variables: {
              sign_in: {
                email_label: "Email",
                password_label: "Şifre",
                button_label: "Giriş Yap",
                email_input_placeholder: "Email adresiniz",
                password_input_placeholder: "Şifreniz",
                link_text: "Hesabınız yok mu? Kayıt olun",
              },
              sign_up: {
                email_label: "Email",
                password_label: "Şifre",
                button_label: "Kayıt Ol",
                email_input_placeholder: "Email adresiniz",
                password_input_placeholder: "Şifreniz",
                link_text: "Zaten hesabınız var mı? Giriş yapın",
              },
              forgotten_password: {
                button_label: "Şifremi Sıfırla",
                link_text: "Şifrenizi mi unuttunuz?",
                email_label: "Email",
                email_input_placeholder: "Email adresiniz",
              },
            },
            messages: {
              sign_up: {
                user_already_exists: "Bu email adresi zaten kayıtlı. Lütfen giriş yapın.",
                password_too_short: "Şifre en az 6 karakter olmalıdır.",
                email_required: "Email adresi gereklidir.",
                password_required: "Şifre gereklidir.",
              },
              sign_in: {
                user_not_found: "Kullanıcı bulunamadı.",
                invalid_credentials: "Email veya şifre hatalı.",
              },
            }
          }}
          providers={[]}
        />
      </div>
    </div>
  );
}