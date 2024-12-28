import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarEvent } from "@/types/calendar";
import { format, isWithinInterval } from "date-fns";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, "id">) => void;
  onDelete?: (eventId: string) => void;
  selectedDate: Date;
  event?: CalendarEvent;
  events: CalendarEvent[];
}

export default function EventDialog({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete,
  selectedDate,
  event,
  events 
}: EventDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      if (event) {
        setTitle(event.title);
        setDescription(event.description || "");
        setStartTime(format(event.start, "HH:mm"));
        setEndTime(format(event.end, "HH:mm"));
      } else {
        const hours = selectedDate.getHours();
        const formattedHours = hours.toString().padStart(2, '0');
        setStartTime(`${formattedHours}:00`);
        setEndTime(`${(hours + 1) % 24}:00`);
        setTitle("");
        setDescription("");
      }
    }
  }, [isOpen, selectedDate, event]);

  const checkEventOverlap = (start: Date, end: Date) => {
    return events.some(existingEvent => {
      if (event && existingEvent.id === event.id) return false;
      
      return (
        isWithinInterval(start, { start: existingEvent.start, end: existingEvent.end }) ||
        isWithinInterval(end, { start: existingEvent.start, end: existingEvent.end }) ||
        isWithinInterval(existingEvent.start, { start, end }) ||
        isWithinInterval(existingEvent.end, { start, end })
      );
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);
    
    const start = new Date(selectedDate);
    start.setHours(startHours, startMinutes);
    
    const end = new Date(selectedDate);
    end.setHours(endHours, endMinutes);

    if (checkEventOverlap(start, end)) {
      toast({
        title: "Zaman Çakışması",
        description: "Bu zaman aralığında başka bir etkinlik bulunuyor.",
        variant: "destructive"
      });
      return;
    }
    
    onSave({
      title,
      description,
      start,
      end,
    });
    
    onClose();
  };

  const handleDelete = () => {
    if (event && onDelete) {
      onDelete(event.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{event ? "Etkinliği Düzenle" : "Etkinlik Ekle"}</DialogTitle>
          <DialogDescription>
            Etkinlik detaylarını buradan düzenleyebilirsiniz.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Başlık</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Etkinlik başlığı"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Açıklama</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Etkinlik açıklaması"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Başlangıç Saati</label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Bitiş Saati</label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="flex justify-between">
            {event && onDelete && (
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDelete}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Sil
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button type="button" variant="outline" onClick={onClose}>
                İptal
              </Button>
              <Button type="submit">Kaydet</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}