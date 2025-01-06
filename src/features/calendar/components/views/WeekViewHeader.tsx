import { format } from "date-fns";
import { tr } from 'date-fns/locale';
import { motion } from "framer-motion";

interface WeekViewHeaderProps {
  date: Date;
}

export default function WeekViewHeader({ date }: WeekViewHeaderProps) {
  return (
    <div className="grid grid-cols-8 divide-x divide-border bg-muted/50">
      <div className="p-2" />
      {Array.from({ length: 7 }, (_, i) => {
        const currentDate = new Date(date);
        currentDate.setDate(currentDate.getDate() - currentDate.getDay() + i + 1);
        
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.15,
              delay: i * 0.01,
              ease: [0.23, 1, 0.32, 1]
            }}
            className="p-2 text-sm font-medium text-center"
          >
            <div className="text-muted-foreground">
              {format(currentDate, "EEE", { locale: tr })}
            </div>
            <div className="text-foreground">
              {format(currentDate, "d MMM", { locale: tr })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}