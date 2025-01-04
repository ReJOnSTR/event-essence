import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

interface ViewSelectorProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const tabVariants = {
  hover: { scale: 1.02 },
  tap: { scale: 0.98 }
};

export function ViewSelector({ currentView, onViewChange }: ViewSelectorProps) {
  const views = ["day", "week", "month", "year"];

  return (
    <div className="w-full bg-background/80 rounded-lg shadow-sm sticky top-0 z-10">
      <Tabs value={currentView} className="w-full">
        <TabsList className="w-full p-0 h-12">
          {views.map((view, index) => (
            <motion.div
              key={view}
              variants={tabVariants}
              whileHover="hover"
              whileTap="tap"
              className="w-full"
            >
              <TabsTrigger 
                value={view}
                onClick={() => onViewChange(view)}
                className="w-full data-[state=active]:bg-transparent relative"
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
                {currentView === view && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    initial={false}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 30,
                      duration: 0.1 
                    }}
                  />
                )}
              </TabsTrigger>
            </motion.div>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}