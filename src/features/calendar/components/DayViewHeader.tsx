import { format } from "date-fns";
import { tr } from 'date-fns/locale';
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { isHoliday } from "@/utils/turkishHolidays";

interface DayViewHeaderProps {
  date: Date;
  holiday: ReturnType<typeof isHoliday>;
  allowWorkOnHolidays: boolean;
}

export default function DayViewHeader({
  date,
  holiday,
  allowWorkOnHolidays
}: DayViewHeaderProps) {
  if (!holiday) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        className={cn(
          "mb-4 p-2 rounded-md border",
          !allowWorkOnHolidays ? 
            "bg-holiday/10 text-holiday-foreground border-holiday-foreground/20" : 
            "bg-working-holiday/10 text-working-holiday-foreground border-working-holiday-foreground/20"
        )}
      >
        {holiday.name} - {allowWorkOnHolidays ? "Çalışmaya Açık Tatil" : "Resmi Tatil"}
      </motion.div>
    </AnimatePresence>
  );
}