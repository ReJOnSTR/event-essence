import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const returnUrl = localStorage.getItem('returnUrl') || '/calendar';
        localStorage.removeItem('returnUrl');
        navigate(returnUrl);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <CalendarDays className="h-10 w-10 text-primary" />
            <CardTitle className="text-3xl font-bold text-primary">Ders Takvimi</CardTitle>
          </div>
          <CardDescription className="text-center text-lg">
            Öğretmen hesabınıza giriş yapın veya yeni hesap oluşturun
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'hsl(var(--primary))',
                    brandAccent: 'hsl(var(--primary-foreground))',
                    brandButtonText: 'hsl(var(--background))',
                    defaultButtonBackground: 'hsl(var(--secondary))',
                    defaultButtonBackgroundHover: 'hsl(var(--accent))',
                    defaultButtonBorder: 'hsl(var(--border))',
                    defaultButtonText: 'hsl(var(--foreground))',
                    dividerBackground: 'hsl(var(--border))',
                    inputBackground: 'hsl(var(--background))',
                    inputBorder: 'hsl(var(--border))',
                    inputBorderHover: 'hsl(var(--ring))',
                    inputBorderFocus: 'hsl(var(--ring))',
                    inputText: 'hsl(var(--foreground))',
                    inputLabelText: 'hsl(var(--muted-foreground))',
                    inputPlaceholder: 'hsl(var(--muted-foreground))',
                  },
                  space: {
                    spaceSmall: '0.75rem',
                    spaceMedium: '1.5rem',
                    spaceLarge: '2rem',
                  },
                  fonts: {
                    bodyFontFamily: `var(--font-sans)`,
                    buttonFontFamily: `var(--font-sans)`,
                    inputFontFamily: `var(--font-sans)`,
                    labelFontFamily: `var(--font-sans)`,
                  },
                  borderWidths: {
                    buttonBorderWidth: '1px',
                    inputBorderWidth: '1px',
                  },
                  radii: {
                    borderRadiusButton: 'var(--radius)',
                    buttonBorderRadius: 'var(--radius)',
                    inputBorderRadius: 'var(--radius)',
                  },
                },
              },
              className: {
                container: 'w-full space-y-4',
                button: 'w-full px-4 py-2.5 rounded-md transition-colors font-medium',
                label: 'text-sm font-medium mb-1.5 block',
                input: 'w-full px-3 py-2 rounded-md border transition-colors text-base',
                loader: 'border-primary',
                anchor: 'text-primary hover:text-primary/80 transition-colors font-medium',
              },
            }}
            theme="default"
            providers={[]}
            redirectTo={window.location.origin}
            localization={{
              variables: {
                sign_up: {
                  email_label: "Email Adresi",
                  password_label: "Şifre",
                  button_label: "Hesap Oluştur",
                  loading_button_label: "Hesap oluşturuluyor...",
                  social_provider_text: "{{provider}} ile devam et",
                  link_text: "Hesabınız yok mu? Hemen oluşturun",
                  confirmation_text: "Email adresinizi kontrol edin",
                },
                sign_in: {
                  email_label: "Email Adresi",
                  password_label: "Şifre",
                  button_label: "Giriş Yap",
                  loading_button_label: "Giriş yapılıyor...",
                  social_provider_text: "{{provider}} ile devam et",
                  link_text: "Zaten hesabınız var mı? Giriş yapın"
                }
              }
            }}
            view="sign_up"
            magicLink={false}
            showLinks={true}
            additionalData={[
              {
                key: 'full_name',
                label: 'Ad Soyad',
                type: 'text',
                required: true,
              },
              {
                key: 'phone_number',
                label: 'Telefon Numarası',
                type: 'tel',
                required: true,
              },
              {
                key: 'teaching_subjects',
                label: 'Öğrettiğiniz Dersler',
                type: 'text',
                required: true,
                placeholder: 'Matematik, Fizik, vb.',
              },
              {
                key: 'years_of_experience',
                label: 'Deneyim Yılı',
                type: 'number',
                required: true,
                min: 0,
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}