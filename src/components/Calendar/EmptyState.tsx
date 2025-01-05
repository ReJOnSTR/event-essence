import { CalendarX2 } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
      <CalendarX2 className="h-12 w-12 text-muted-foreground/60" />
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-[300px]">{description}</p>
    </div>
  );
}