import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/services/api/supabase";
import { Button } from "@/components/common/Button";
import { useToast } from "@/hooks/use-toast";
import { SubjectSelect } from "../SubjectSelect";
import { PersonalInfoFields } from "./FormFields/PersonalInfoFields";
import { ContactFields } from "./FormFields/ContactFields";
import { SecurityFields } from "./FormFields/SecurityFields";
import { RegisterFormData } from "./types";

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
