import { cn } from "@/lib/utils";

interface MonthHeaderProps {
  days: string[];
}

export default function MonthHeader({ days }: MonthHeaderProps) {
  return (
    <>
      {days.map((day) => (
        <div
          key={day}
          className={cn(
            "bg-muted/50 p-2 text-sm font-medium text-muted-foreground text-center border-b border-border"
          )}
        >
          {day}
        </div>
      ))}
    </>
  );
}