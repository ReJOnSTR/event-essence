import { useState } from "react";
import MonthView from "@/components/Calendar/MonthView";
import DayView from "@/components/Calendar/DayView";
import WeekView from "@/components/Calendar/WeekView";
import YearView from "@/components/Calendar/YearView";
import EventDialog from "@/components/Calendar/EventDialog";
import { CalendarEvent } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

type ViewType = "day" | "week" | "month" | "year";

export default function Index() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<ViewType>("month");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toast } = useToast();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(undefined);
    setIsDialogOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedDate(event.start);
    setIsDialogOpen(true);
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
    toast({
      title: "Etkinlik güncellendi",
      description: "Etkinlik başarıyla taşındı.",
    });
  };

  const handleSaveEvent = (eventData: Omit<CalendarEvent, "id">) => {
    if (selectedEvent) {
      const updatedEvents = events.map(event => 
        event.id === selectedEvent.id 
          ? { ...eventData, id: event.id }
          : event
      );
      setEvents(updatedEvents);
      toast({
        title: "Etkinlik güncellendi",
        description: "Etkinliğiniz başarıyla güncellendi.",
      });
    } else {
      const newEvent: CalendarEvent = {
        ...eventData,
        id: crypto.randomUUID(),
      };
      setEvents([...events, newEvent]);
      toast({
        title: "Etkinlik oluşturuldu",
        description: "Etkinliğiniz başarıyla oluşturuldu.",
      });
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
    toast({
      title: "Etkinlik silindi",
      description: "Etkinliğiniz başarıyla silindi.",
    });
  };

  const renderView = () => {
    const viewProps = {
      date: selectedDate,
      events,
      onDateSelect: handleDateSelect,
      onEventClick: handleEventClick,
      onEventUpdate: handleEventUpdate,
    };

    switch (currentView) {
      case "day":
        return <DayView {...viewProps} />;
      case "week":
        return <WeekView {...viewProps} />;
      case "year":
        return <YearView {...viewProps} />;
      default:
        return <MonthView {...viewProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 flex flex-col">
        <div className="w-full px-4">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Takvim</h1>
            <Button onClick={() => {
              setSelectedEvent(undefined);
              setIsDialogOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Etkinlik Ekle
            </Button>
          </div>

          <Tabs value={currentView} className="w-full mb-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="day" onClick={() => setCurrentView("day")}>
                Günlük
              </TabsTrigger>
              <TabsTrigger value="week" onClick={() => setCurrentView("week")}>
                Haftalık
              </TabsTrigger>
              <TabsTrigger value="month" onClick={() => setCurrentView("month")}>
                Aylık
              </TabsTrigger>
              <TabsTrigger value="year" onClick={() => setCurrentView("year")}>
                Yıllık
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 px-4 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-180px)]">
            {renderView()}
          </ScrollArea>
        </div>
        
        <EventDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedEvent(undefined);
          }}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          selectedDate={selectedDate}
          event={selectedEvent}
          events={events}
        />
      </div>

      {/* Collapsible Right Sidebar */}
      <div className={`fixed right-0 top-0 h-full bg-white shadow-lg transition-all duration-300 ${isSidebarOpen ? 'w-80' : 'w-12'}`}>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute left-0 top-4 w-12 h-12 flex items-center justify-center text-gray-500 hover:text-gray-700"
        >
          {isSidebarOpen ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
        </button>
        {isSidebarOpen && (
          <div className="p-4 mt-16">
            {/* Content will be added later */}
          </div>
        )}
      </div>
    </div>
  );
}
