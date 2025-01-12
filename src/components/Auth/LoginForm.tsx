import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthError, AuthApiError } from "@supabase/supabase-js";

interface LoginFormProps {
  onToggleForm: () => void;
}

const getErrorMessage = (error: AuthError) => {
  if (error instanceof AuthApiError) {
    switch (error.status) {
      case 400:
        return 'Geçersiz email veya şifre';
      case 422:
        return 'Email adresinizi doğrulamanız gerekiyor';
      case 401:
        return 'Giriş bilgileri hatalı';
      default:
        return error.message;
    }
  }
  return error.message;
};

export function LoginForm({ onToggleForm }: LoginFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
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
      <div className="space-y-2">
        <Label htmlFor="email">Email Adresi</Label>
        <div className="relative">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="ornek@email.com"
            value={formData.email}
            onChange={handleInputChange}
            className={cn("pl-10", errors.email && "border-destructive")}
          />
          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Şifre</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleInputChange}
            className={cn("pl-10", errors.password && "border-destructive")}
          />
          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password}</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={loading}
      >
        {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
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