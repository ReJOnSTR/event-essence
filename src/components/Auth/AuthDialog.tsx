import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "../ui/use-toast";
import { useEffect, useRef } from "react";
import { useSessionContext } from '@supabase/auth-helpers-react';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthDialog({ isOpen, onClose }: AuthDialogProps) {
  const { session } = useSessionContext();
  const { toast } = useToast();
  const hasShownToast = useRef(false);

  // Close dialog and show toast when user is logged in
  useEffect(() => {
    if (session && !hasShownToast.current) {
      onClose();
      toast({
        title: "Başarıyla giriş yapıldı",
        description: `Hoş geldiniz, ${session.user.email}`,
        duration: 3000,
      });
      hasShownToast.current = true;
    }
    
    // Reset the ref when the dialog is closed
    if (!isOpen) {
      hasShownToast.current = false;
    }
  }, [session, onClose, toast, isOpen]);

  return (
    <Dialog open={isOpen && !session} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
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
                  brand: '#1a73e8',
                  brandAccent: '#1557b0',
                }
              }
            }
          }}
          theme="light"
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