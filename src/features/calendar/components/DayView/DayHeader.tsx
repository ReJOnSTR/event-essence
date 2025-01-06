import { format } from "date-fns";
import { tr } from 'date-fns/locale';

interface DayHeaderProps {
  hour: number;
}

export default function DayHeader({ hour }: DayHeaderProps) {
  return (
    <div className="col-span-1 text-right text-sm text-muted-foreground relative">
      {`${hour.toString().padStart(2, '0')}:00`}
    </div>
  );
}