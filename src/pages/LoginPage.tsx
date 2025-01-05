import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, Users, BookOpen, Shield, CheckCircle } from "lucide-react";

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

  const features = [
    {
      icon: <CalendarDays className="h-8 w-8 text-primary" />,
      title: "Takvim Yönetimi",
      description: "Derslerinizi kolayca planlayın ve takip edin"
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Öğrenci Takibi",
      description: "Öğrencilerinizin gelişimini izleyin"
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Zaman Yönetimi",
      description: "Çalışma saatlerinizi etkin bir şekilde planlayın"
    }
  ];

  const benefits = [
    {
      icon: <BookOpen className="h-5 w-5 text-primary" />,
      text: "Kolay ders programı oluşturma"
    },
    {
      icon: <Shield className="h-5 w-5 text-primary" />,
      text: "Güvenli veri saklama"
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-primary" />,
      text: "Otomatik hatırlatmalar"
    }
  ];

  return (
    <div className="min-h-screen w-full bg-background flex flex-col lg:flex-row">
      {/* Sol taraf - Özellikler */}
      <div className="lg:w-1/2 h-full p-8 lg:p-16 flex flex-col justify-center bg-gradient-to-br from-background via-accent/10 to-background">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-6">
            Öğretmenler İçin Ders Takip Sistemi
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground mb-12">
            Derslerinizi planlayın, öğrencilerinizi takip edin ve zamanınızı etkili bir şekilde yönetin.
          </p>
          
          <div className="grid gap-6 mb-12">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="flex items-start space-x-4 p-6 rounded-xl bg-card/50 hover:bg-accent/50 transition-colors border border-border/50"
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-2 bg-accent/20 px-4 py-2 rounded-full border border-border/50"
              >
                {benefit.icon}
                <span>{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sağ taraf - Giriş formu */}
      <div className="lg:w-1/2 h-full p-8 lg:p-16 flex items-center justify-center bg-gradient-to-bl from-background via-muted/5 to-background">
        <Card className="w-full max-w-md border-border/50">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <CalendarDays className="h-12 w-12 text-primary" />
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
                    confirmation_text: "Email adresinizi kontrol edin"
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
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}