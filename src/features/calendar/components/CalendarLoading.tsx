import { Loader2 } from "lucide-react";

export const CalendarLoading = () => {
  return (
    <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
};