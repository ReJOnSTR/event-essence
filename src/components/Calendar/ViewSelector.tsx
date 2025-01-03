import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

interface ViewSelectorProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const tabVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 }
};

export default function ViewSelector({ currentView, onViewChange }: ViewSelectorProps) {
  return (
    <Tabs value={currentView} className="w-full">
      <TabsList className="grid w-full grid-cols-4 relative">
        <AnimatePresence mode="wait">
          <motion.div
            className="absolute inset-0 bg-primary/10 rounded-md"
            layoutId="tab-background"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        </AnimatePresence>
        {["day", "week", "month", "year"].map((view) => (
          <TabsTrigger
            key={view}
            value={view}
            onClick={() => onViewChange(view)}
            className="relative z-10"
          >
            <motion.span
              initial="initial"
              animate="animate"
              exit="exit"
              variants={tabVariants}
              transition={{ duration: 0.2 }}
            >
              {view === "day" && "Günlük"}
              {view === "week" && "Haftalık"}
              {view === "month" && "Aylık"}
              {view === "year" && "Yıllık"}
            </motion.span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}