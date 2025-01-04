import { format } from "date-fns";
import { tr } from 'date-fns/locale';
import { motion } from "framer-motion";

export default function MonthHeader() {
  return (
    <div className="grid grid-cols-7 gap-px bg-calendar-border rounded-t-lg overflow-hidden">
      {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((day, index) => (
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
    </div>
  );
}