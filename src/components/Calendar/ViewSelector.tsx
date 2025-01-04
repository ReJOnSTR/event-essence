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
    <div className="w-full bg-white rounded-lg">
      <Tabs value={currentView} className="w-full">
        <TabsList className="grid w-full grid-cols-4 gap-1 md:gap-2 bg-[#F1F0FB] p-1">
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
                className="w-full relative text-xs md:text-sm py-1.5 md:py-2 text-[#8E9196] data-[state=active]:bg-white data-[state=active]:text-[#7E69AB] data-[state=active]:shadow-sm"
              >
                {view === "day" && (isMobile ? "Gün" : "Günlük")}
                {view === "week" && (isMobile ? "Hafta" : "Haftalık")}
                {view === "month" && (isMobile ? "Ay" : "Aylık")}
                {view === "year" && (isMobile ? "Yıl" : "Yıllık")}
                {currentView === view && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9b87f5]"
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