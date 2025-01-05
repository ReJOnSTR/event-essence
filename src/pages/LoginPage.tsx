import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

export default function LoginPage() {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Hoş Geldiniz</h1>
          <p className="text-muted-foreground">
            Devam etmek için lütfen giriş yapın
          </p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#000000',
                    brandAccent: '#666666',
                  },
                },
              },
            }}
            providers={[]}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Şifre',
                  button_label: 'Giriş Yap',
                },
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Şifre',
                  button_label: 'Kayıt Ol',
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}