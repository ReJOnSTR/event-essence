interface WeekHourLabelProps {
  hour: number;
}

export default function WeekHourLabel({ hour }: WeekHourLabelProps) {
  return (
    <div className="sticky left-0 bg-background/80 p-2 text-sm font-medium text-muted-foreground text-center border-r border-border">
      {hour}:00
    </div>
  );
}