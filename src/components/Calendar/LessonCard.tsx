import { CalendarEvent, Student } from "@/types/calendar";
import { format, differenceInMinutes } from "date-fns";
import { tr } from 'date-fns/locale';
import { useDrag } from 'react-dnd';
import { useToast } from "@/components/ui/use-toast";

interface EventCardProps {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
  students?: Student[];
  onEventUpdate?: (event: CalendarEvent) => void;
}

export default function LessonCard({ event, onClick, students, onEventUpdate }: EventCardProps) {
  const { toast } = useToast();
  const durationInMinutes = differenceInMinutes(event.end, event.start);
  const heightInPixels = (durationInMinutes / 60) * 60;
  const student = students?.find(s => s.id === event.studentId);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'LESSON',
    item: { event },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
      e.preventDefault();
      const lessonData = {
        ...event,
        id: crypto.randomUUID(),
      };
      localStorage.setItem('copiedLesson', JSON.stringify(lessonData));
      toast({
        title: "Ders kopyalandı",
        description: "Dersi yapıştırmak için Ctrl+V veya ⌘+V tuşlarını kullanın",
      });
    }
  };

  const style = {
    height: `${heightInPixels}px`,
    top: `${(new Date(event.start).getMinutes() / 60) * 60}px`,
    zIndex: 10,
    backgroundColor: student?.color || "#039be5",
    opacity: isDragging ? 0.5 : 1,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <div 
      ref={drag}
      className="text-white text-sm p-1 rounded absolute left-0 right-0 mx-1 overflow-hidden cursor-pointer hover:brightness-90 transition-all"
      style={style}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="font-medium truncate">
        {student?.name || "İsimsiz Öğrenci"}
      </div>
      <div className="text-xs">
        {format(event.start, "HH:mm", { locale: tr })} - {format(event.end, "HH:mm", { locale: tr })}
      </div>
    </div>
  );
}