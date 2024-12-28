import { useState } from "react";
import MonthView from "@/components/Calendar/MonthView";
import DayView from "@/components/Calendar/DayView";
import WeekView from "@/components/Calendar/WeekView";
import YearView from "@/components/Calendar/YearView";
import EventDialog from "@/components/Calendar/EventDialog";
import { CalendarEvent } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ViewType = "day" | "week" | "month" | "year";

export default function Index() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<ViewType>("month");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>();
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
      // Update existing event
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
      // Create new event
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
        return <MonthView events={events} onDateSelect={handleDateSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
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
        
        {renderView()}
        
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
        />
      </div>
    </div>
  );
}