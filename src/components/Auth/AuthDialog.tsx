import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { AuthError, AuthResponse } from "@supabase/supabase-js";

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
                password_input_placeholder: 'Şifreniz'
              },
              sign_up: {
                email_label: 'E-posta',
                password_label: 'Şifre',
                button_label: 'Kaydol',
                loading_button_label: 'Kaydolunuyor...',
                email_input_placeholder: 'E-posta adresiniz',
                password_input_placeholder: 'Şifreniz'
              }
            }
          }}
          theme="light"
          providers={[]}
          onError={(error: AuthError) => {
            if (error.message.includes("email_address_invalid")) {
              toast({
                title: "Geçersiz e-posta",
                description: "Lütfen geçerli bir e-posta adresi girin.",
                variant: "destructive"
              });
            } else if (error.message.includes("over_email_send_rate_limit")) {
              toast({
                title: "Çok fazla deneme",
                description: "Lütfen 20 saniye bekleyip tekrar deneyin.",
                variant: "destructive"
              });
            } else if (error.message.includes("invalid_credentials")) {
              toast({
                title: "Giriş başarısız",
                description: "E-posta veya şifre hatalı.",
                variant: "destructive"
              });
            } else {
              toast({
                title: "Hata",
                description: error.message,
                variant: "destructive"
              });
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}