import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { CalendarEvent } from "@/types/calendar";
import { Copy, Paste, Edit, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface LessonContextMenuProps {
  children: React.ReactNode;
  event: CalendarEvent;
  onEdit?: (event: CalendarEvent) => void;
  onDelete?: (event: CalendarEvent) => void;
  onCopy?: (event: CalendarEvent) => void;
  onPaste?: () => void;
  canPaste?: boolean;
}

export default function LessonContextMenu({
  children,
  event,
  onEdit,
  onDelete,
  onCopy,
  onPaste,
  canPaste = false,
}: LessonContextMenuProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    onCopy?.(event);
    toast({
      title: "Ders kopyalandı",
      description: "Ders bilgileri panoya kopyalandı.",
    });
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={handleCopy} className="gap-2">
          <Copy className="h-4 w-4" />
          Kopyala
        </ContextMenuItem>
        {canPaste && (
          <ContextMenuItem onClick={onPaste} className="gap-2">
            <Paste className="h-4 w-4" />
            Yapıştır
          </ContextMenuItem>
        )}
        <ContextMenuItem onClick={() => onEdit?.(event)} className="gap-2">
          <Edit className="h-4 w-4" />
          Düzenle
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onDelete?.(event)} className="gap-2 text-red-600">
          <Trash className="h-4 w-4" />
          Sil
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}