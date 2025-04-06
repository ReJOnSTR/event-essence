
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Calendar, LayoutGrid, CalendarDays, Calendar as CalendarIcon } from "lucide-react";

interface ViewSelectorProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export default function ViewSelector({ currentView, onViewChange }: ViewSelectorProps) {
  const isMobile = useIsMobile();

  return (
    <div className="w-full bg-background/80 rounded-lg shadow-sm sticky top-0 z-10 pb-1">
      <Tabs value={currentView} className="w-full">
        <TabsList className="grid w-full grid-cols-4 p-1 bg-muted/50 rounded-lg">
          {[
            { id: "day", icon: <Calendar className="w-4 h-4" />, label: isMobile ? "Gün" : "Günlük" },
            { id: "week", icon: <LayoutGrid className="w-4 h-4" />, label: isMobile ? "Hafta" : "Haftalık" },
            { id: "month", icon: <CalendarDays className="w-4 h-4" />, label: isMobile ? "Ay" : "Aylık" },
            { id: "year", icon: <CalendarIcon className="w-4 h-4" />, label: isMobile ? "Yıl" : "Yıllık" }
          ].map((view) => (
            <TabsTrigger 
              key={view.id}
              value={view.id} 
              onClick={() => onViewChange(view.id)}
              className={cn(
                "flex items-center justify-center gap-1 py-2 relative transition-all duration-300",
                "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                "data-[state=active]:shadow-md hover:bg-accent/50",
                "rounded-md text-xs md:text-sm"
              )}
            >
              {currentView === view.id ? (
                <div className="flex items-center gap-1.5 transition-all duration-300">
                  <span className="opacity-100">{view.icon}</span>
                  <span className="font-medium">{view.label}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 transition-all duration-300 opacity-70 hover:opacity-90">
                  <span>{view.icon}</span>
                  <span className="font-medium">{view.label}</span>
                </div>
              )}
              
              {currentView === view.id && (
                <span 
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2/3 h-0.5 bg-primary-foreground/50 rounded-full"
                  style={{
                    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                  }}
                />
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
