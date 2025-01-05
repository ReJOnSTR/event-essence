import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface InputFieldProps {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
  maxLength?: number;
  minLength?: number;
  required?: boolean;
  pattern?: string;
  isValid?: boolean;
}

export function InputField({
  id,
  name,
  type,
  label,
  placeholder,
  value,
  onChange,
  error,
  icon,
  maxLength,
  minLength,
  required,
  pattern,
  isValid,
}: InputFieldProps) {
  const showCharCount = maxLength && type === 'text';
  const charCount = value.length;

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          className={cn(
            "pl-10",
            error && "border-destructive",
            isValid && "border-green-500 pr-10"
          )}
        />
        {icon && (
          <span className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground">
            {icon}
          </span>
        )}
        {isValid && (
          <Check className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
        )}
      </div>
      {showCharCount && (
        <p className={cn(
          "text-xs text-muted-foreground",
          charCount > (maxLength - 10) && "text-yellow-600",
          charCount === maxLength && "text-destructive"
        )}>
          {charCount}/{maxLength} karakter
        </p>
      )}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}