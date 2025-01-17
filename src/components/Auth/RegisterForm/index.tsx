import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SubjectSelect } from "../SubjectSelect";
import { PersonalInfoFields } from "./FormFields/PersonalInfoFields";
import { ContactFields } from "./FormFields/ContactFields";
import { SecurityFields } from "./FormFields/SecurityFields";
import { RegisterFormData } from "./types";
import { Separator } from "@/components/ui/separator";

interface RegisterFormProps {
  onToggleForm: () => void;
}

export function RegisterForm({ onToggleForm }: RegisterFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const form = useForm<RegisterFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      teachingSubjects: [],
    }
  });

  const { handleSubmit, setValue, watch, formState: { errors } } = form;
  const teachingSubjects = watch('teachingSubjects');

  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Google ile kayıt başarısız",
          description: error.message
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Bir hata oluştu",
        description: "Google ile kayıt olurken bir hata oluştu."
      });
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: `${data.firstName} ${data.lastName}`,
            phone_number: data.phoneNumber,
            teaching_subjects: data.teachingSubjects,
          }
        }
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Kayıt başarısız",
          description: error.message
        });
      } else {
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <PersonalInfoFields form={form} />
      <ContactFields form={form} />
      <SecurityFields form={form} />

      <div className="space-y-2">
        <SubjectSelect
          selectedSubjects={teachingSubjects}
          onChange={(subjects) => {
            setValue('teachingSubjects', subjects);
          }}
        />
        {errors.teachingSubjects && (
          <p className="text-sm text-destructive">{errors.teachingSubjects.message}</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={loading}
      >
        {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
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
        onClick={handleGoogleSignup}
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
        Google ile Kayıt Ol
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