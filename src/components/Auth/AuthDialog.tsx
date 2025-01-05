import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "../ui/use-toast";
import { useEffect } from "react";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthDialog({ isOpen, onClose }: AuthDialogProps) {
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        onClose();
        toast({
          title: "Başarıyla giriş yapıldı",
          duration: 2000,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [onClose, toast]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-[425px] bg-background border-border overflow-hidden">
        <DialogTitle className="text-xl font-semibold mb-4 text-foreground">
          Hesap
        </DialogTitle>
        <div className="max-h-[80vh] overflow-y-auto">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}