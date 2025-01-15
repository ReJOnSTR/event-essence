import { Button as ShadcnButton } from "@/components/ui/button";

interface ButtonProps extends React.ComponentProps<typeof ShadcnButton> {
  variant?: "default" | "outline" | "destructive";
}

export const Button = ({ variant = "default", ...props }: ButtonProps) => {
  return <ShadcnButton variant={variant} {...props} />;
};
