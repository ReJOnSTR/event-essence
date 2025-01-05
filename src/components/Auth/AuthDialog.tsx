import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthDialog({ isOpen, onClose }: AuthDialogProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN") {
        // Tüm query'leri invalidate et ve yeni verileri çek
        await queryClient.invalidateQueries();
        
        toast({
          title: "Giriş Başarılı",
          description: "Hoş geldiniz!",
          duration: 3000,
        });
        
        onClose();
        navigate("/calendar");
      } else if (event === "SIGNED_OUT") {
        // Cache'i temizle
        queryClient.clear();
        
        toast({
          title: "Çıkış Yapıldı",
          description: "Güvenli bir şekilde çıkış yaptınız.",
          duration: 3000,
        });
        
        navigate("/calendar");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, onClose, queryClient, toast]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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