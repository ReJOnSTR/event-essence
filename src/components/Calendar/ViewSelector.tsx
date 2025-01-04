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
    scale: 0.98
  },
  animate: { 
    opacity: 1,
    scale: 1,
    transition: {
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
    <div className="w-full bg-background">
      <Tabs value={currentView} className="w-full">
        <TabsList className="inline-flex h-auto w-full justify-start gap-2 bg-transparent p-0 text-muted-foreground">
          <AnimatePresence mode="wait">
            {views.map((view) => (
              <motion.div
                key={view.id}
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="relative"
              >
                <TabsTrigger 
                  value={view.id} 
                  onClick={() => onViewChange(view.id)}
                  className={`
                    relative px-3 py-2 text-sm font-medium transition-all
                    hover:text-foreground
                    data-[state=active]:text-calendar-blue
                    data-[state=active]:dark:text-calendar-blue-dark
                  `}
                >
                  {view.label}
                  {currentView === view.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-[1px] left-0 right-0 h-0.5 rounded-full bg-calendar-blue dark:bg-calendar-blue-dark"
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