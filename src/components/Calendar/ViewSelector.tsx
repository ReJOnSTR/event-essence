import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

interface ViewSelectorProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export default function ViewSelector({ currentView, onViewChange }: ViewSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Tabs value={currentView} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {["day", "week", "month", "year"].map((view) => (
            <motion.div
              key={view}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <TabsTrigger 
                value={view} 
                onClick={() => onViewChange(view)}
                className="relative"
              >
                {view === "day" && "Günlük"}
                {view === "week" && "Haftalık"}
                {view === "month" && "Aylık"}
                {view === "year" && "Yıllık"}
                {currentView === view && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
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