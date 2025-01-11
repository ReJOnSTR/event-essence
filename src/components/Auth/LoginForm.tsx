import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoginFormProps {
  onToggleForm: () => void;
}

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
    } else if (formData.password.length < 6) {
      newErrors.password = "Şifre en az 6 karakter olmalıdır";
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
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            variant: "destructive",
            title: "Giriş başarısız",
            description: "Email veya şifre hatalı"
          });
        } else {
          toast({
            variant: "destructive",
            title: "Giriş başarısız",
            description: error.message
          });
        }
      } else {
        toast({
          title: "Giriş başarılı",
          description: "Yönlendiriliyorsunuz..."
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Bir hata oluştu",
        description: "Lütfen daha sonra tekrar deneyin."
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
            className={cn(
              "pl-10",
              errors.email && "border-destructive focus-visible:ring-destructive"
            )}
            disabled={loading}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>
        {errors.email && (
          <p className="text-sm text-destructive" id="email-error" role="alert">
            {errors.email}
          </p>
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
            className={cn(
              "pl-10",
              errors.password && "border-destructive focus-visible:ring-destructive"
            )}
            disabled={loading}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>
        {errors.password && (
          <p className="text-sm text-destructive" id="password-error" role="alert">
            {errors.password}
          </p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Giriş yapılıyor...
          </>
        ) : (
          "Giriş Yap"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Hesabınız yok mu?{" "}
        <Button 
          variant="link" 
          className="p-0 h-auto font-normal"
          onClick={onToggleForm}
          type="button"
          disabled={loading}
        >
          Kayıt olun
        </Button>
      </p>
    </form>
  );
}