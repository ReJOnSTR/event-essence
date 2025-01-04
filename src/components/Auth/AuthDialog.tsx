import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthDialog({ isOpen, onClose }: AuthDialogProps) {
  const { toast } = useToast();

  // Listen for auth state changes and errors
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        toast({
          title: "Çıkış yapıldı",
          description: "Başarıyla çıkış yaptınız."
        });
      } else if (event === "PASSWORD_RECOVERY") {
        toast({
          title: "Şifre sıfırlama",
          description: "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi."
        });
      } else if (event === "USER_UPDATED") {
        toast({
          title: "Profil güncellendi",
          description: "Profiliniz başarıyla güncellendi."
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Giriş Yap veya Kaydol</DialogTitle>
        </DialogHeader>
        
        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            style: {
              button: {
                borderRadius: '6px',
                height: '40px'
              },
              input: {
                borderRadius: '6px',
                height: '40px'
              },
              message: {
                borderRadius: '6px',
                padding: '10px',
                marginBottom: '10px'
              }
            }
          }}
          localization={{
            variables: {
              sign_in: {
                email_label: 'E-posta',
                password_label: 'Şifre',
                button_label: 'Giriş Yap',
                loading_button_label: 'Giriş yapılıyor...',
                email_input_placeholder: 'E-posta adresiniz',
                password_input_placeholder: 'Şifreniz',
                email_address_invalid: 'Geçersiz e-posta adresi',
                invalid_credentials: 'E-posta veya şifre hatalı',
                over_email_send_rate_limit: 'Çok fazla deneme yapıldı, lütfen 20 saniye bekleyin'
              },
              sign_up: {
                email_label: 'E-posta',
                password_label: 'Şifre',
                button_label: 'Kaydol',
                loading_button_label: 'Kaydolunuyor...',
                email_input_placeholder: 'E-posta adresiniz',
                password_input_placeholder: 'Şifreniz',
                email_address_invalid: 'Geçersiz e-posta adresi',
                over_email_send_rate_limit: 'Çok fazla deneme yapıldı, lütfen 20 saniye bekleyin'
              }
            }
          }}
          theme="light"
          providers={[]}
        />
      </DialogContent>
    </Dialog>
  );
}