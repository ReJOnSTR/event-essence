import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Phone, Clock, Mail, Lock } from "lucide-react";
import { SubjectSelect } from "./SubjectSelect";

interface RegisterFormProps {
  onToggleForm: () => void;
}

const PASSWORD_RULES = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: true,
};

export function RegisterForm({ onToggleForm }: RegisterFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    teachingSubjects: [] as string[],
    yearsOfExperience: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePassword = (password: string) => {
    if (password.length < PASSWORD_RULES.minLength) {
      return `Şifre en az ${PASSWORD_RULES.minLength} karakter olmalıdır`;
    }
    if (PASSWORD_RULES.requireUppercase && !/[A-Z]/.test(password)) {
      return "Şifre en az bir büyük harf içermelidir";
    }
    if (PASSWORD_RULES.requireLowercase && !/[a-z]/.test(password)) {
      return "Şifre en az bir küçük harf içermelidir";
    }
    if (PASSWORD_RULES.requireNumber && !/\d/.test(password)) {
      return "Şifre en az bir rakam içermelidir";
    }
    if (PASSWORD_RULES.requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Şifre en az bir özel karakter içermelidir";
    }
    return "";
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Ad alanı zorunludur";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Soyad alanı zorunludur";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email alanı zorunludur";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Geçerli bir email adresi giriniz";
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Telefon numarası zorunludur";
    } else if (!/^05[0-9]{9}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = "Geçerli bir telefon numarası giriniz (05XX XXX XX XX)";
    }

    if (formData.teachingSubjects.length === 0) {
      newErrors.teachingSubjects = "En az bir ders seçmelisiniz";
    }

    if (!formData.yearsOfExperience) {
      newErrors.yearsOfExperience = "Deneyim yılı zorunludur";
    } else if (parseInt(formData.yearsOfExperience) < 0) {
      newErrors.yearsOfExperience = "Deneyim yılı 0'dan küçük olamaz";
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

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: `${formData.firstName} ${formData.lastName}`,
            phone_number: formData.phoneNumber,
            teaching_subjects: formData.teachingSubjects,
            years_of_experience: parseInt(formData.yearsOfExperience)
          }
        }
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Kayıt başarısız",
          description: error.message
        });
      } else if (data) {
        toast({
          title: "Kayıt başarılı",
          description: "Email adresinizi kontrol edin ve hesabınızı doğrulayın."
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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Ad</Label>
          <div className="relative">
            <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Ad"
              value={formData.firstName}
              onChange={handleInputChange}
              className={cn("pl-10", errors.firstName && "border-destructive")}
            />
            <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
          {errors.firstName && (
            <p className="text-sm text-destructive">{errors.firstName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Soyad</Label>
          <div className="relative">
            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Soyad"
              value={formData.lastName}
              onChange={handleInputChange}
              className={cn("pl-10", errors.lastName && "border-destructive")}
            />
            <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
          {errors.lastName && (
            <p className="text-sm text-destructive">{errors.lastName}</p>
          )}
        </div>
      </div>

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

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Telefon Numarası</Label>
        <div className="relative">
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            placeholder="05XX XXX XX XX"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className={cn("pl-10", errors.phoneNumber && "border-destructive")}
          />
          <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>
        {errors.phoneNumber && (
          <p className="text-sm text-destructive">{errors.phoneNumber}</p>
        )}
      </div>

      <div className="space-y-2">
        <SubjectSelect
          selectedSubjects={formData.teachingSubjects}
          onChange={(subjects) => {
            setFormData(prev => ({ ...prev, teachingSubjects: subjects }));
            if (errors.teachingSubjects) {
              setErrors(prev => ({ ...prev, teachingSubjects: '' }));
            }
          }}
        />
        {errors.teachingSubjects && (
          <p className="text-sm text-destructive">{errors.teachingSubjects}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="yearsOfExperience">Deneyim Yılı</Label>
        <div className="relative">
          <Input
            id="yearsOfExperience"
            name="yearsOfExperience"
            type="number"
            min="0"
            placeholder="3"
            value={formData.yearsOfExperience}
            onChange={handleInputChange}
            className={cn("pl-10", errors.yearsOfExperience && "border-destructive")}
          />
          <Clock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>
        {errors.yearsOfExperience && (
          <p className="text-sm text-destructive">{errors.yearsOfExperience}</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={loading}
      >
        {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Zaten hesabınız var mı?{" "}
        <Button 
          variant="link" 
          className="p-0 h-auto font-normal"
          onClick={onToggleForm}
          type="button"
        >
          Giriş yapın
        </Button>
      </p>
    </form>
  );
}