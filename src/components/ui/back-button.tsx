import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  to?: string;
  label?: string;
  className?: string;
}

export function BackButton({ label = "Geri Dön", className }: BackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    navigate("/");
  };

  // Don't show back button on home page
  if (location.pathname === "/") return null;

  return (
    <Button
      variant="ghost"
      onClick={handleBack}
      className={cn(
        "flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors",
        className
      )}
    >
      <ArrowLeft className="h-5 w-5" />
      <span>{label}</span>
    </Button>
  );
}