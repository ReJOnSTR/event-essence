import { UseFormReturn } from "react-hook-form";
import { InputField } from "@/components/Auth/FormFields/InputField";
import { Lock } from "lucide-react";
import { RegisterFormData } from "../types";
import { validatePassword } from "@/components/Auth/validation/registerValidation";

interface SecurityFieldsProps {
  form: UseFormReturn<RegisterFormData>;
}

export function SecurityFields({ form }: SecurityFieldsProps) {
  const { register, formState: { errors } } = form;

  return (
    <InputField
      id="password"
      type="password"
      label="Şifre"
      placeholder="••••••••"
      error={errors.password?.message}
      icon={<Lock />}
      {...register("password", {
        required: "Şifre alanı zorunludur",
        validate: {
          strength: (value) => validatePassword(value) || "Şifre gereksinimleri karşılanmıyor"
        }
      })}
    />
  );
}