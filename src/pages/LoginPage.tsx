import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/calendar');
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate('/calendar');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'hsl(var(--primary))',
                    brandAccent: 'hsl(var(--primary))',
                  },
                },
              },
            }}
            theme="light"
            providers={[]}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Şifre',
                  button_label: 'Giriş Yap',
                  loading_button_label: 'Giriş yapılıyor...',
                  social_provider_text: 'ile giriş yap',
                  link_text: 'Zaten hesabınız var mı? Giriş yapın',
                },
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Şifre',
                  button_label: 'Kayıt Ol',
                  loading_button_label: 'Kayıt olunuyor...',
                  social_provider_text: 'ile kayıt ol',
                  link_text: 'Hesabınız yok mu? Kayıt olun',
                },
                magic_link: {
                  button_label: 'Sihirli bağlantı gönder',
                  loading_button_label: 'Gönderiliyor...',
                },
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}