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
    y: 0,
    scale: 0.98
  },
  animate: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "tween",
      duration: 0.2,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: {
      duration: 0.15
    }
  },
  hover: {
    backgroundColor: "rgba(var(--primary) / 0.1)",
    transition: {
      duration: 0.2
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
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Tabs value={currentView} className="w-full">
        <TabsList className="grid w-full grid-cols-4 p-1 bg-transparent">
          <AnimatePresence mode="wait">
            {views.map((view) => (
              <motion.div
                key={view.id}
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                whileHover="hover"
                className="w-full"
              >
                <TabsTrigger 
                  value={view.id} 
                  onClick={() => onViewChange(view.id)}
                  className="w-full relative text-xs md:text-sm py-2 transition-all duration-200 rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  {view.label}
                  {currentView === view.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 380,
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
    </div>
  );
}