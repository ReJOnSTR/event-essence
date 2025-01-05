import { UseFormReturn } from "react-hook-form";
import { InputField } from "../../FormFields/InputField";
import { Mail, Phone } from "lucide-react";
import { RegisterFormData } from "../types";

interface ContactFieldsProps {
  form: UseFormReturn<RegisterFormData>;
}

export function ContactFields({ form }: ContactFieldsProps) {
  const { register, formState: { errors } } = form;

  return (
    <>
      <InputField
        id="email"
        label="Email Adresi"
        placeholder="ornek@email.com"
        error={errors.email?.message}
        icon={<Mail />}
        {...register("email", {
          required: "Email alanı zorunludur",
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: "Geçerli bir email adresi giriniz"
          }
        })}
      />

      <InputField
        id="phoneNumber"
        label="Telefon Numarası"
        placeholder="05XX XXX XX XX"
        error={errors.phoneNumber?.message}
        icon={<Phone />}
        {...register("phoneNumber", {
          required: "Telefon numarası zorunludur",
          pattern: {
            value: /^0[0-9]{10}$/,
            message: "Geçerli bir telefon numarası giriniz (05XX XXX XX XX)"
          }
        })}
      />
    </>
  );
}