import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface ViewSelectorProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const tabVariants = {
  initial: { opacity: 0, y: -4 },
  animate: { opacity: 1, y: 0 },
  hover: { 
    scale: 1.02,
    transition: { duration: 0.2 }
  },
  tap: { scale: 0.98 }
};

const activeIndicatorVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30
    }
  }
};

export default function ViewSelector({ currentView, onViewChange }: ViewSelectorProps) {
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 500, damping: 30 }}
      className="w-full bg-background/80 backdrop-blur-sm rounded-lg shadow-sm sticky top-0 z-10 border border-border/50"
    >
      <Tabs value={currentView} className="w-full">
        <TabsList className="grid w-full grid-cols-4 p-1 gap-1 h-auto bg-transparent">
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
                  "w-full relative py-2.5 text-sm font-medium transition-all",
                  "data-[state=active]:text-primary-foreground",
                  "data-[state=active]:shadow-none",
                  "hover:text-primary-foreground/90",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:pointer-events-none disabled:opacity-50"
                )}
              >
                {view === "day" && (isMobile ? "Gün" : "Günlük")}
                {view === "week" && (isMobile ? "Hafta" : "Haftalık")}
                {view === "month" && (isMobile ? "Ay" : "Aylık")}
                {view === "year" && (isMobile ? "Yıl" : "Yıllık")}
                
                {currentView === view && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-calendar-blue dark:bg-calendar-blue-dark rounded-md"
                    variants={activeIndicatorVariants}
                    initial="initial"
                    animate="animate"
                    style={{ zIndex: -1 }}
                  />
                )}
              </TabsTrigger>
            </motion.div>
          ))}
        </TabsList>
      </Tabs>
    </motion.div>
  );
}