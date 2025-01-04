import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function AuthPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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
              },
              sign_up: {
                email_label: "Email",
                password_label: "Şifre",
                button_label: "Kayıt Ol",
              },
            },
          }}
        />
      </div>
    </div>
  );
}