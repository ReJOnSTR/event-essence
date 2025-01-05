import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface ViewSelectorProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const tabVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  hover: { 
    scale: 1.02,
    transition: { duration: 0.15 }
  },
  tap: { scale: 0.98 }
};

export default function ViewSelector({ currentView, onViewChange }: ViewSelectorProps) {
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="w-full bg-background rounded-lg shadow-sm sticky top-0 z-10"
    >
      <Tabs value={currentView} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-muted/50">
          {["day", "week", "month", "year"].map((view, index) => (
            <motion.div
              key={view}
              variants={tabVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="w-full"
            >
              <TabsTrigger 
                value={view} 
                onClick={() => onViewChange(view)}
                className={cn(
                  "w-full relative py-2 text-sm font-medium transition-all",
                  "data-[state=active]:bg-accent",
                  "data-[state=active]:text-accent-foreground",
                  "hover:text-accent-foreground/90",
                  "focus-visible:ring-0"
                )}
              >
                {view === "day" && (isMobile ? "Gün" : "Günlük")}
                {view === "week" && (isMobile ? "Hafta" : "Haftalık")}
                {view === "month" && (isMobile ? "Ay" : "Aylık")}
                {view === "year" && (isMobile ? "Yıl" : "Yıllık")}
              </TabsTrigger>
            </motion.div>
          ))}
        </TabsList>
      </Tabs>
    </motion.div>
  );
}