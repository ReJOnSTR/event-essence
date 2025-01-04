import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface ViewSelectorProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const tabVariants = {
  initial: { y: -5, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 }
};

export default function ViewSelector({ currentView, onViewChange }: ViewSelectorProps) {
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, type: "tween" }}
      className="w-full bg-background/80 rounded-lg shadow-sm sticky top-0 z-10"
    >
      <Tabs value={currentView} className="w-full">
        <TabsList className="grid w-full grid-cols-4 gap-1 md:gap-2">
          {["day", "week", "month", "year"].map((view, index) => (
            <motion.div
              key={view}
              variants={tabVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
              transition={{ duration: 0.15, delay: index * 0.05 }}
              className="w-full"
            >
              <TabsTrigger 
                value={view} 
                onClick={() => onViewChange(view)}
                className="w-full relative text-xs md:text-sm py-1.5 md:py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {view === "day" && (isMobile ? "Gün" : "Günlük")}
                {view === "week" && (isMobile ? "Hafta" : "Haftalık")}
                {view === "month" && (isMobile ? "Ay" : "Aylık")}
                {view === "year" && (isMobile ? "Yıl" : "Yıllık")}
                {currentView === view && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
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