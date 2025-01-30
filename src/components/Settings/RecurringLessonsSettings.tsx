import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Lesson, Student } from "@/types/calendar";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Calendar } from "lucide-react";
import { useLessons } from "@/hooks/useLessons";
import { useStudents } from "@/hooks/useStudents";
import { useToast } from "@/hooks/use-toast";

export default function RecurringLessonsSettings() {
  const { lessons, deleteLesson } = useLessons();
  const { students } = useStudents();
  const { toast } = useToast();

  // Filter lessons with recurrence_type set to weekly or monthly
  const recurringLessons = lessons.filter(lesson => 
    lesson.recurrenceType === "weekly" || lesson.recurrenceType === "monthly"
  );

  const groupedLessons = recurringLessons.reduce((acc, lesson) => {
    // Group by studentId and recurrenceType combination
    const key = `${lesson.studentId}-${lesson.recurrenceType}-${lesson.recurrenceInterval}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(lesson);
    return acc;
  }, {} as Record<string, Lesson[]>);

  const handleDeleteSeries = (lessons: Lesson[]) => {
    lessons.forEach(lesson => {
      deleteLesson(lesson.id);
    });
    toast({
      title: "Tekrarlanan dersler silindi",
      description: "Seçilen tekrarlanan dersler başarıyla silindi.",
    });
  };

  const getStudentName = (studentId: string | undefined) => {
    return students.find(s => s.id === studentId)?.name || "Öğrenci Silinmiş";
  };

  const getRecurrenceText = (type: string, interval: number = 1) => {
    const baseText = type === "weekly" ? "Her hafta" : "Her ay";
    return interval > 1 ? `${baseText} (${interval} aralıkla)` : baseText;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Tekrarlanan Dersler
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
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
                      {getStudentName(lessons[0].studentId)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {getRecurrenceText(lessons[0].recurrenceType || '', lessons[0].recurrenceInterval || 1)}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteSeries(lessons)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Seriyi Sil
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {lessons.map(lesson => (
                    <div
                      key={lesson.id}
                      className="text-sm p-2 bg-muted rounded flex justify-between items-center"
                    >
                      <span>
                        {format(new Date(lesson.start), "d MMMM yyyy, EEEE", { locale: tr })}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteLesson(lesson.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
      </CardContent>
    </Card>
  );
}