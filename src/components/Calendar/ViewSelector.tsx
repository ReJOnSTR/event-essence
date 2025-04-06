
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface ViewSelectorProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const viewOptions = [
  { value: "day", labelShort: "Gün", labelFull: "Günlük" },
  { value: "week", labelShort: "Hafta", labelFull: "Haftalık" },
  { value: "month", labelShort: "Ay", labelFull: "Aylık" },
  { value: "year", labelShort: "Yıl", labelFull: "Yıllık" },
];

export default function ViewSelector({ currentView, onViewChange }: ViewSelectorProps) {
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full bg-background/5 backdrop-blur-sm rounded-md shadow-md sticky top-0 z-10 overflow-hidden"
    >
      <div className="flex w-full h-12">
        {viewOptions.map((option) => (
          <motion.button
            key={option.value}
            onClick={() => onViewChange(option.value)}
            className={cn(
              "relative flex-1 flex items-center justify-center text-sm font-medium transition-all duration-200 h-full",
              currentView === option.value 
                ? "text-foreground bg-white"
                : "text-foreground/70 hover:text-foreground hover:bg-white/10"
            )}
            initial={false}
            animate={{
              backgroundColor: currentView === option.value ? "rgba(255, 255, 255, 1)" : "transparent",
              color: currentView === option.value ? "#333333" : "rgba(255, 255, 255, 0.7)",
            }}
            transition={{ duration: 0.2 }}
          >
            {isMobile ? option.labelShort : option.labelFull}
            
            {currentView === option.value && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-full bg-white"
                layoutId="activeViewIndicator"
                initial={false}
                style={{ zIndex: -1 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
