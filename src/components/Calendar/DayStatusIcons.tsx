import { Flag, Sun, Moon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DayStatusIconsProps {
  isHoliday?: boolean;
  isWorkingHoliday?: boolean;
  isNonWorkingDay?: boolean;
  holidayName?: string;
  className?: string;
}

export default function DayStatusIcons({
  isHoliday,
  isWorkingHoliday,
  isNonWorkingDay,
  holidayName,
  className
}: DayStatusIconsProps) {
  if (!isHoliday && !isWorkingHoliday && !isNonWorkingDay) return null;

  return (
    <div className={`absolute top-1 right-1 flex gap-0.5 ${className}`}>
      <TooltipProvider>
        {isHoliday && (
          <Tooltip>
            <TooltipTrigger>
              <Flag className="h-4 w-4 text-holiday-icon" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{holidayName || "Resmi Tatil"}</p>
            </TooltipContent>
          </Tooltip>
        )}
        {isWorkingHoliday && (
          <Tooltip>
            <TooltipTrigger>
              <Sun className="h-4 w-4 text-working-holiday-icon" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{holidayName} (Çalışmaya Açık)</p>
            </TooltipContent>
          </Tooltip>
        )}
        {isNonWorkingDay && (
          <Tooltip>
            <TooltipTrigger>
              <Moon className="h-4 w-4 text-non-working-icon" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Çalışma Saatleri Kapalı</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
}