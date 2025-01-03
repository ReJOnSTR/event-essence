import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { tr } from 'date-fns/locale';
import { useLanguage } from "@/contexts/LanguageContext";

interface CalendarHeaderProps {
  date: Date;
  onPrevious: (e: React.MouseEvent) => void;
  onNext: (e: React.MouseEvent) => void;
  onToday: (e: React.MouseEvent) => void;
  title: string;
}

export default function CalendarHeader({ 
  date, 
  onPrevious, 
  onNext, 
  onToday,
  title 
}: CalendarHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="text-2xl font-semibold">
        {title || format(date, "MMMM yyyy", { locale: tr })}
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onPrevious}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline"
          onClick={onToday}
          className="flex gap-2 items-center"
        >
          <CalendarDays className="h-4 w-4" />
          {t.common.today}
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}