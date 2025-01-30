import { Sun, Moon, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DayStatusIconsProps {
  isHoliday: boolean;
  isCustomHoliday: boolean;
  allowWorkOnHolidays: boolean;
  isWorkingDay: boolean;
  className?: string;
  showLabels?: boolean;
}

export default function DayStatusIcons({
  isHoliday,
  isCustomHoliday,
  allowWorkOnHolidays,
  isWorkingDay,
  className,
  showLabels = false
}: DayStatusIconsProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <TooltipProvider>
        {(isHoliday || isCustomHoliday) && (
          <Tooltip>
            <TooltipTrigger>
              <Flag 
                className={cn(
                  "h-4 w-4",
                  !allowWorkOnHolidays ? "text-destructive" : "text-yellow-500"
                )} 
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{isCustomHoliday ? "Özel Tatil" : "Resmi Tatil"}</p>
              {allowWorkOnHolidays && <p>Çalışmaya Açık</p>}
            </TooltipContent>
          </Tooltip>
        )}
        
        {!isHoliday && !isCustomHoliday && (
          <Tooltip>
            <TooltipTrigger>
              {isWorkingDay ? (
                <Sun className="h-4 w-4 text-green-500" />
              ) : (
                <Moon className="h-4 w-4 text-muted-foreground" />
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>{isWorkingDay ? "Çalışma Saatleri Açık" : "Çalışma Saatleri Kapalı"}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
}