import { motion } from "framer-motion";

interface MonthHeaderProps {
  weekDays: string[];
}

export default function MonthHeader({ weekDays }: MonthHeaderProps) {
  return (
    <>
      {weekDays.map((day, index) => (
        <motion.div
          key={day}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.15,
            delay: index * 0.01,
            ease: [0.23, 1, 0.32, 1]
          }}
          className="bg-background/80 p-2 text-sm font-medium text-muted-foreground text-center"
        >
          {day}
        </motion.div>
      ))}
    </>
  );
}