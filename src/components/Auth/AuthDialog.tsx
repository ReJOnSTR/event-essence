import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "../ui/use-toast";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthDialog({ isOpen, onClose }: AuthDialogProps) {
  const { toast } = useToast();

  const showErrorToast = (message: string) => {
    toast({
      title: "Hata",
      description: message,
      variant: "destructive",
      duration: 3000,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-background border-border">
        <DialogTitle className="text-2xl font-semibold mb-6 text-center text-foreground">
          Öğretmen Hesabı
        </DialogTitle>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--primary))',
                  brandAccent: 'hsl(var(--primary-foreground))',
                  brandButtonText: 'white',
                  defaultButtonBackground: 'hsl(var(--secondary))',
                  defaultButtonBackgroundHover: 'hsl(var(--accent))',
                  defaultButtonBorder: 'hsl(var(--border))',
                  defaultButtonText: 'hsl(var(--foreground))',
                  dividerBackground: 'hsl(var(--border))',
                  inputBackground: 'transparent',
                  inputBorder: 'hsl(var(--border))',
                  inputBorderHover: 'hsl(var(--ring))',
                  inputBorderFocus: 'hsl(var(--ring))',
                  inputText: 'hsl(var(--foreground))',
                  inputLabelText: 'hsl(var(--muted-foreground))',
                  inputPlaceholder: 'hsl(var(--muted-foreground))',
                },
                space: {
                  spaceSmall: '4px',
                  spaceMedium: '8px',
                  spaceLarge: '16px',
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
              input: 'w-full px-3 py-2 rounded-md border bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary',
              loader: 'border-primary',
              anchor: 'text-sm text-primary hover:text-primary/80 transition-colors',
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
                button_label: "Kayıt Ol",
                loading_button_label: "Kayıt olunuyor...",
                social_provider_text: "{{provider}} ile devam et",
                link_text: "Hesabınız yok mu? Hemen kayıt olun",
                confirmation_text: "Email adresinizi kontrol edin",
                password_validation: "Şifreniz en az 6 karakter olmalıdır"
              },
              sign_in: {
                email_label: "Email Adresi",
                password_label: "Şifre",
                button_label: "Giriş Yap",
                loading_button_label: "Giriş yapılıyor...",
                social_provider_text: "{{provider}} ile devam et",
                link_text: "Zaten hesabınız var mı? Giriş yapın",
                password_validation: "Şifreniz en az 6 karakter olmalıdır"
              },
              forgotten_password: {
                email_label: "Email Adresi",
                password_label: "Yeni Şifre",
                button_label: "Şifremi Sıfırla",
                loading_button_label: "Sıfırlama linki gönderiliyor...",
                link_text: "Şifrenizi mi unuttunuz?",
                confirmation_text: "Şifre sıfırlama linkini email adresinize gönderdik"
              }
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}