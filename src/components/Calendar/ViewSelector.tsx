import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();

  const views = [
    { value: "day", label: t.calendar.views.day },
    { value: "week", label: t.calendar.views.week },
    { value: "month", label: t.calendar.views.month },
    { value: "year", label: t.calendar.views.year }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, type: "tween" }}
      className="w-full bg-white rounded-lg shadow-sm p-2"
    >
      <Tabs value={currentView} className="w-full">
        <TabsList className="grid w-full grid-cols-4 gap-2 p-1">
          {views.map((view, index) => (
            <motion.div
              key={view.value}
              variants={tabVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
              transition={{ duration: 0.15, delay: index * 0.05 }}
              className="w-full"
            >
              <TabsTrigger 
                value={view.value} 
                onClick={() => onViewChange(view.value)}
                className="w-full relative data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {view.label}
                {currentView === view.value && (
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