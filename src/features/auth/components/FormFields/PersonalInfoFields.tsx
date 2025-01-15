import { UseFormReturn } from "react-hook-form";
import { InputField } from "@/components/Auth/FormFields/InputField";
import { User } from "lucide-react";
import { RegisterFormData } from "../types";

interface PersonalInfoFieldsProps {
  form: UseFormReturn<RegisterFormData>;
}

export function PersonalInfoFields({ form }: PersonalInfoFieldsProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="grid grid-cols-2 gap-4">
      <InputField
        id="firstName"
        label="Ad"
        placeholder="Ad"
        error={errors.firstName?.message}
        icon={<User />}
        {...register("firstName", {
          required: "Ad alanı zorunludur",
          minLength: {
            value: 2,
            message: "En az 2 karakter giriniz"
          },
          maxLength: {
            value: 50,
            message: "En fazla 50 karakter girebilirsiniz"
          }
        })}
      />

      <InputField
        id="lastName"
        label="Soyad"
        placeholder="Soyad"
        error={errors.lastName?.message}
        icon={<User />}
        {...register("lastName", {
          required: "Soyad alanı zorunludur",
          minLength: {
            value: 2,
            message: "En az 2 karakter giriniz"
          },
          maxLength: {
            value: 50,
            message: "En fazla 50 karakter girebilirsiniz"
          }
        })}
      />
    </div>
  );
}