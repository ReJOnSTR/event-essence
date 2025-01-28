import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/Auth/FormFields/InputField";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Lock } from "lucide-react";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  onToggleForm: () => void;
}

const getErrorMessage = (error: AuthError) => {
  if (error instanceof AuthApiError) {
    switch (error.status) {
      case 400:
        if (error.message.includes("Invalid login credentials")) {
          return 'Email veya şifre hatalı';
        }
        return 'Geçersiz email veya şifre';
      case 422:
        return 'Email adresinizi doğrulamanız gerekiyor';
      case 401:
        return 'Giriş bilgileri hatalı';
      case 403:
        return 'Oturum süresi dolmuş. Lütfen tekrar giriş yapın.';
      default:
        return error.message;
    }
  }
  return error.message;
};

export function LoginForm({ onToggleForm }: LoginFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/calendar');
        toast({
          title: "Giriş başarılı",
          description: "Ana sayfaya yönlendiriliyorsunuz...",
        });
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email alanı zorunludur";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Geçerli bir email adresi giriniz";
    }

    if (!formData.password) {
      newErrors.password = "Şifre alanı zorunludur";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/calendar`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Google ile giriş başarısız",
          description: error instanceof AuthError ? getErrorMessage(error) : "Bir hata oluştu"
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Bir hata oluştu",
        description: "Google ile giriş yapılırken bir hata oluştu."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // First ensure no existing invalid session
      await supabase.auth.signOut();

      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Giriş başarısız",
          description: getErrorMessage(error),
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Bir hata oluştu",
        description: "Lütfen daha sonra tekrar deneyin.",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        id="email"
        name="email"
        type="email"
        label="Email Adresi"
        placeholder="ornek@email.com"
        value={formData.email}
        onChange={handleInputChange}
        error={errors.email}
        icon={<Mail />}
        required
      />

      <InputField
        id="password"
        name="password"
        type="password"
        label="Şifre"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleInputChange}
        error={errors.password}
        icon={<Lock />}
        required
      />

      <Button 
        type="submit" 
        className="w-full"
        disabled={loading}
      >
        {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Ya da
          </span>
        </div>
      </div>

      <Button 
        type="button"
        variant="outline" 
        className="w-full"
        onClick={handleGoogleLogin}
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Google ile Giriş Yap
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Hesabınız yok mu?{" "}
        <Button 
          variant="link" 
          className="p-0 h-auto font-normal"
          onClick={onToggleForm}
          type="button"
        >
          Kayıt olun
        </Button>
      </p>
    </form>
  );
}