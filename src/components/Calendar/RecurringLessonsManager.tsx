import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Lesson } from "@/types/calendar";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Edit } from "lucide-react";

interface RecurringLessonsManagerProps {
  lessons: Lesson[];
  onEdit: (lesson: Lesson) => void;
  onDelete: (lessonId: string) => void;
}

export default function RecurringLessonsManager({
  lessons,
  onEdit,
  onDelete
}: RecurringLessonsManagerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const recurringLessons = lessons.filter(lesson => lesson.recurrenceType !== "none");
  const groupedLessons = recurringLessons.reduce((acc, lesson) => {
    const key = `${lesson.recurrenceType}-${lesson.recurrenceCount}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(lesson);
    return acc;
  }, {} as Record<string, Lesson[]>);

  const handleDeleteSeries = (lessons: Lesson[]) => {
    lessons.forEach(lesson => onDelete(lesson.id));
    setIsOpen(false);
  };

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(true)}
        className="w-full"
      >
        Tekrarlanan Dersleri Yönet
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Tekrarlanan Dersler</DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="h-[400px] mt-4">
            <AnimatePresence>
              {Object.entries(groupedLessons).map(([key, lessons]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6 p-4 border rounded-lg"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium">
                        {lessons[0].title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {lessons[0].recurrenceType === "weekly" && "Her hafta"}
                        {lessons[0].recurrenceType === "monthly" && "Her ay"}
                        {lessons[0].recurrenceCount > 1 && ` (${lessons[0].recurrenceCount} kez)`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEdit(lessons[0])}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteSeries(lessons)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {lessons.map(lesson => (
                      <div
                        key={lesson.id}
                        className="text-sm p-2 bg-muted rounded"
                      >
                        {format(new Date(lesson.start), "d MMMM yyyy, EEEE", { locale: tr })}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
              
              {Object.keys(groupedLessons).length === 0 && (
                <div className="text-center text-muted-foreground p-4">
                  Tekrarlanan ders bulunmamaktadır.
                </div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}