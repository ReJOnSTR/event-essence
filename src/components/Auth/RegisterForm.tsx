import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User, Phone, Mail, Lock } from "lucide-react";
import { SubjectSelect } from "./SubjectSelect";
import { InputField } from "./FormFields/InputField";
import { validatePassword, FIELD_RULES } from "./validation/registerValidation";
import { cn } from "@/lib/utils";

interface RegisterFormProps {
  onToggleForm: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  teachingSubjects: string[];
}

export function RegisterForm({ onToggleForm }: RegisterFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    teachingSubjects: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validFields, setValidFields] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string | string[]) => {
    const rules = FIELD_RULES[name];
    if (!rules) return "";

    if (rules.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return "Bu alan zorunludur";
    }

    if ('minLength' in rules && typeof value === 'string') {
      if (value.length < rules.minLength) {
        return `En az ${rules.minLength} karakter giriniz`;
      }
    }

    if ('maxLength' in rules && typeof value === 'string') {
      if (value.length > rules.maxLength) {
        return `En fazla ${rules.maxLength} karakter girebilirsiniz`;
      }
    }

    if ('pattern' in rules && typeof value === 'string') {
      if (!rules.pattern.test(value)) {
        if (name === "email") {
          return "Geçerli bir email adresi giriniz";
        }
        if (name === "phoneNumber") {
          return "Geçerli bir telefon numarası giriniz (05XX XXX XX XX)";
        }
      }
    }

    if ('minItems' in rules && Array.isArray(value)) {
      if (value.length < rules.minItems) {
        return "En az bir ders seçmelisiniz";
      }
    }

    return "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    const error = name === "password" 
      ? validatePassword(value)
      : validateField(name, value);
    
    setErrors(prev => ({ ...prev, [name]: error }));
    setValidFields(prev => ({ ...prev, [name]: !error && value.length > 0 }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(formData).forEach(key => {
      const value = formData[key as keyof FormData];
      const error = key === "password" 
        ? validatePassword(value as string)
        : validateField(key, value);
      
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
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
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
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
        <InputField
          id="firstName"
          name="firstName"
          type="text"
          label="Ad"
          placeholder="Ad"
          value={formData.firstName}
          onChange={handleInputChange}
          error={errors.firstName}
          icon={<User />}
          maxLength={50}
          minLength={2}
          required
          isValid={validFields.firstName}
        />

        <InputField
          id="lastName"
          name="lastName"
          type="text"
          label="Soyad"
          placeholder="Soyad"
          value={formData.lastName}
          onChange={handleInputChange}
          error={errors.lastName}
          icon={<User />}
          maxLength={50}
          minLength={2}
          required
          isValid={validFields.lastName}
        />
      </div>

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
        isValid={validFields.email}
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
        minLength={8}
        required
        isValid={validFields.password}
      />

      <InputField
        id="phoneNumber"
        name="phoneNumber"
        type="tel"
        label="Telefon Numarası"
        placeholder="05XX XXX XX XX"
        value={formData.phoneNumber}
        onChange={handleInputChange}
        error={errors.phoneNumber}
        icon={<Phone />}
        required
        isValid={validFields.phoneNumber}
      />

      <div className="space-y-2">
        <SubjectSelect
          selectedSubjects={formData.teachingSubjects}
          onChange={(subjects) => {
            setFormData(prev => ({ ...prev, teachingSubjects: subjects }));
            const error = validateField('teachingSubjects', subjects);
            setErrors(prev => ({ ...prev, teachingSubjects: error }));
            setValidFields(prev => ({ ...prev, teachingSubjects: !error }));
          }}
        />
        {errors.teachingSubjects && (
          <p className="text-sm text-destructive">{errors.teachingSubjects}</p>
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