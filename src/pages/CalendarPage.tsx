import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CalendarContent from "@/features/calendar/components/CalendarContent";
import { useCalendarStore } from "@/store/calendarStore";
import { useStudents } from "@/hooks/useStudents";
import { useToast } from "@/components/ui/use-toast";
import { CalendarEvent } from "@/types/calendar";
import { useState } from "react";
import AuthOverlay from "@/components/auth/AuthOverlay";
import CalendarHeader from "@/components/Calendar/CalendarHeader";
import CalendarToolbar from "./components/CalendarToolbar";

const queryClient = new QueryClient();

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [lessons, setLessons] = useState<CalendarEvent[]>(() => {
    const savedLessons = localStorage.getItem('lessons');
    return savedLessons ? JSON.parse(savedLessons) : [];
  });
  
  const { currentView } = useCalendarStore();
  const { students } = useStudents();
  const { toast } = useToast();

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    const updatedLessons = lessons.map(lesson =>
      lesson.id === updatedEvent.id ? updatedEvent : lesson
    );
    setLessons(updatedLessons);
    localStorage.setItem('lessons', JSON.stringify(updatedLessons));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-background">
        <AuthOverlay />
        <CalendarHeader />
        <CalendarToolbar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        <div className="flex-1 p-4">
          <CalendarContent
            currentView={currentView}
            selectedDate={selectedDate}
            lessons={lessons}
            onDateSelect={(date) => setSelectedDate(date)}
            onEventClick={() => {}}
            onEventUpdate={handleEventUpdate}
            students={students}
          />
        </div>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}