import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface ViewSelectorProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const tabVariants = {
  initial: { 
    opacity: 0,
    y: -10,
    scale: 0.95
  },
  animate: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.95
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2
    }
  },
  tap: {
    scale: 0.95
  }
};

const containerVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function ViewSelector({ currentView, onViewChange }: ViewSelectorProps) {
  const isMobile = useIsMobile();

  const views = [
    { id: "day", label: isMobile ? "Gün" : "Günlük" },
    { id: "week", label: isMobile ? "Hafta" : "Haftalık" },
    { id: "month", label: isMobile ? "Ay" : "Aylık" },
    { id: "year", label: isMobile ? "Yıl" : "Yıllık" }
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={containerVariants}
      className="w-full bg-background/80 backdrop-blur-sm rounded-lg shadow-sm sticky top-0 z-10"
    >
      <Tabs value={currentView} className="w-full">
        <TabsList className="grid w-full grid-cols-4 gap-1 md:gap-2 p-1">
          <AnimatePresence mode="wait">
            {views.map((view) => (
              <motion.div
                key={view.id}
                variants={tabVariants}
                whileHover="hover"
                whileTap="tap"
                className="w-full"
              >
                <TabsTrigger 
                  value={view.id} 
                  onClick={() => onViewChange(view.id)}
                  className="w-full relative text-xs md:text-sm py-1.5 md:py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
                >
                  {view.label}
                  {currentView === view.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30
                      }}
                    />
                  )}
                </TabsTrigger>
              </motion.div>
            ))}
          </AnimatePresence>
        </TabsList>
      </Tabs>
    </motion.div>
  );
}