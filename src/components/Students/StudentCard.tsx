import { Student } from "@/types/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StudentCardProps {
  student: Student;
  onClick: (student: Student) => void;
}

export default function StudentCard({ student, onClick }: StudentCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card 
        className={cn(
          "flex flex-col cursor-pointer transition-all",
          "transform hover:scale-[1.02]"
        )}
        onClick={() => onClick(student)}
      >
        <CardContent className="flex-1 p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center",
                "text-white text-base sm:text-xl font-semibold shrink-0"
              )}
              style={{ backgroundColor: student.color }}
            >
              {student.name.charAt(0)}
            </motion.div>
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "text-base sm:text-lg font-semibold truncate",
                "leading-tight"
              )}>
                {student.name}
              </h3>
              <p className={cn(
                "text-sm text-muted-foreground mt-0.5",
                "truncate"
              )}>
                Ders Ücreti: {student.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
