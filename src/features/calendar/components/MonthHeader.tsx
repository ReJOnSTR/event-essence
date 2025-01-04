import { motion } from "framer-motion";

interface MonthHeaderProps {
  days: string[];
}

export default function MonthHeader({ days }: MonthHeaderProps) {
  return (
    <>
      {days.map((day, index) => (
        <motion.div
          key={day}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.15,
            delay: index * 0.01,
            ease: [0.23, 1, 0.32, 1]
          }}
          className="bg-gray-50 p-2 text-sm font-medium text-calendar-gray text-center"
        >
          {day}
        </motion.div>
      ))}
    </>
  );
}