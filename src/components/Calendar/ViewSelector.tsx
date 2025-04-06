
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
      className="w-full bg-accent/30 backdrop-blur-sm rounded-md shadow-md sticky top-0 z-10 overflow-hidden border border-accent/20"
    >
      <div className="flex w-full h-12">
        {viewOptions.map((option) => (
          <motion.button
            key={option.value}
            onClick={() => onViewChange(option.value)}
            className={cn(
              "relative flex-1 flex items-center justify-center text-sm font-medium transition-all duration-200 h-full",
              currentView === option.value 
                ? "text-accent-foreground"
                : "text-foreground/70 hover:text-foreground"
            )}
          >
            {isMobile ? option.labelShort : option.labelFull}
            
            {currentView === option.value && (
              <motion.div
                className="absolute inset-0 bg-accent shadow-md"
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
