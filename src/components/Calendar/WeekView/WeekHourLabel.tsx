import React from "react";

interface WeekHourLabelProps {
  hour: number;
}

export default function WeekHourLabel({ hour }: WeekHourLabelProps) {
  return (
    <div className="bg-background p-2 text-right text-sm text-muted-foreground border-b border-border">
      {`${hour.toString().padStart(2, '0')}:00`}
    </div>
  );
}