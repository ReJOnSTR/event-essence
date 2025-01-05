import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthDialog({ isOpen, onClose }: AuthDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-background">
        <DialogTitle className="text-xl font-semibold mb-4">
          Hesap
        </DialogTitle>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--primary))',
                  brandAccent: 'hsl(var(--primary))',
                  brandButtonText: 'white',
                  defaultButtonBackground: 'white',
                  defaultButtonBackgroundHover: '#eee',
                  defaultButtonBorder: 'lightgray',
                  defaultButtonText: 'gray',
                  dividerBackground: '#eee',
                  inputBackground: 'transparent',
                  inputBorder: 'lightgray',
                  inputBorderHover: 'gray',
                  inputBorderFocus: 'gray',
                  inputText: 'black',
                  inputPlaceholder: 'darkgray',
                },
              },
            },
            className: {
              container: 'w-full',
              button: 'w-full px-4 py-2 rounded-md transition-colors',
              label: 'text-sm font-medium',
              input: 'w-full px-3 py-2 rounded-md border transition-colors',
              loader: 'border-primary',
            },
          }}
          theme="default"
          providers={[]}
          redirectTo={window.location.origin}
          localization={{
            variables: {
              sign_up: {
                email_label: "Email",
                password_label: "Şifre",
                button_label: "Kayıt Ol",
                loading_button_label: "Kayıt olunuyor...",
                social_provider_text: "{{provider}} ile devam et",
                link_text: "Hesabınız yok mu? Kayıt olun",
                confirmation_text: "Email adresinizi kontrol edin"
              },
              sign_in: {
                email_label: "Email",
                password_label: "Şifre",
                button_label: "Giriş Yap",
                loading_button_label: "Giriş yapılıyor...",
                social_provider_text: "{{provider}} ile devam et",
                link_text: "Zaten hesabınız var mı? Giriş yapın"
              }
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}