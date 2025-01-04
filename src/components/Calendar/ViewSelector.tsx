import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface ViewSelectorProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export default function ViewSelector({ currentView, onViewChange }: ViewSelectorProps) {
  const isMobile = useIsMobile();

  return (
    <div className="w-full bg-background/80 rounded-lg shadow-sm">
      <Tabs value={currentView} className="w-full">
        <TabsList className="grid w-full grid-cols-4 gap-1 md:gap-2">
          {["day", "week", "month", "year"].map((view) => (
            <motion.div
              key={view}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.1 }}
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
                    transition={{ duration: 0.15 }}
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