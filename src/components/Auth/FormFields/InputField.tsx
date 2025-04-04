
import React, { forwardRef } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  icon?: React.ReactNode;
  isValid?: boolean;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ id, label, error, icon, isValid, className, required, ...props }, ref) => {
    const showCharCount = props.maxLength && props.type === 'text';
    const charCount = (props.value as string)?.length || 0;

    return (
      <div className="space-y-2">
        <Label htmlFor={id} className="flex items-center gap-1">
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
        <div className="relative">
          <Input
            ref={ref}
            id={id}
            className={cn(
              "pl-10 focus:outline-none focus:ring-0",
              error && "border-destructive",
              isValid && "border-green-500 pr-10",
              className
            )}
            {...props}
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
            charCount > (props.maxLength! - 10) && "text-yellow-600",
            charCount === props.maxLength && "text-destructive"
          )}>
            {charCount}/{props.maxLength} karakter
          </p>
        )}
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';
