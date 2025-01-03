import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ViewSelector from "./ViewSelector";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { motion } from "framer-motion";

interface CalendarPageHeaderProps {
  date: Date;
  currentView: string;
  onViewChange: (view: string) => void;
  onPrevious: (e: React.MouseEvent) => void;
  onNext: (e: React.MouseEvent) => void;
  onToday: (e: React.MouseEvent) => void;
}

const headerVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

export default function CalendarPageHeader({
  date,
  currentView,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
}: CalendarPageHeaderProps) {
  const getHeaderText = () => {
    switch (currentView) {
      case "day":
        return format(date, "d MMMM yyyy, EEEE", { locale: tr });
      case "week":
        return format(date, "MMMM yyyy", { locale: tr });
      case "month":
        return format(date, "MMMM yyyy", { locale: tr });
      case "year":
        return format(date, "yyyy", { locale: tr });
      default:
        return "";
    }
  };

  return (
    <motion.div 
      className="flex flex-col gap-4 p-4 border-b bg-white"
      variants={headerVariants}
      initial="initial"
      animate="animate"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant="outline"
              size="icon"
              onClick={onPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </motion.div>
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant="outline"
              size="icon"
              onClick={onNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant="outline"
              onClick={onToday}
            >
              Bugün
            </Button>
          </motion.div>
        </div>
        <motion.h2 
          className="text-lg font-semibold"
          key={getHeaderText()}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          {getHeaderText()}
        </motion.h2>
      </div>
      <ViewSelector currentView={currentView} onViewChange={onViewChange} />
    </motion.div>
  );
}