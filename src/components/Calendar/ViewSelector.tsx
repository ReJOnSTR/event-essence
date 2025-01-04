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
    <div className="w-full">
      <Tabs value={currentView} className="w-full">
        <TabsList className="inline-flex h-10 w-full justify-start rounded-lg bg-[#1A1F2C] p-1 text-muted-foreground shadow-md">
          <AnimatePresence mode="wait">
            {views.map((view) => (
              <motion.div
                key={view.id}
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="relative flex-1"
              >
                <TabsTrigger 
                  value={view.id} 
                  onClick={() => onViewChange(view.id)}
                  className={`
                    relative w-full rounded-md px-3 py-1.5 text-sm font-medium transition-all
                    hover:bg-[#222222]/80 hover:text-white
                    data-[state=active]:bg-[#333333] data-[state=active]:text-white data-[state=active]:shadow-sm
                  `}
                >
                  {view.label}
                </TabsTrigger>
              </motion.div>
            ))}
          </AnimatePresence>
        </TabsList>
      </Tabs>
    </div>
  );
}