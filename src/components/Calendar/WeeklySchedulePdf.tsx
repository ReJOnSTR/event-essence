import { Button } from "@/components/ui/button";
import { Share, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { tr } from 'date-fns/locale';
import { Student, Lesson } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

interface WeeklySchedulePdfProps {
  lessons: Lesson[];
  students: Student[];
}

export function WeeklySchedulePdf({ lessons, students }: WeeklySchedulePdfProps) {
  const { toast } = useToast();
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  const generatePDF = () => {
    if (!selectedStudentId) {
      toast({
        title: "Hata",
        description: "Lütfen bir öğrenci seçin",
        variant: "destructive",
      });
      return;
    }

    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    doc.setFont("helvetica");
    const pageWidth = doc.internal.pageSize.width;
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    // Header
    doc.setFontSize(20);
    doc.text("Haftalık Ders Programı", pageWidth / 2, 20, { align: "center" });

    // Student Info & Date Range
    doc.setFontSize(12);
    doc.text(`Öğrenci: ${student.name}`, 20, 35);
    const dateRange = `${format(weekStart, 'd MMMM yyyy', { locale: tr })} - ${format(weekEnd, 'd MMMM yyyy', { locale: tr })}`;
    doc.text(dateRange, pageWidth / 2, 45, { align: "center" });

    // Filter lessons for the current week and student
    const weeklyLessons = lessons.filter(lesson => {
      const lessonDate = new Date(lesson.start);
      return lesson.studentId === selectedStudentId &&
             lessonDate >= weekStart &&
             lessonDate <= weekEnd;
    });

    // Prepare table data
    const tableData = weekDays.map(day => {
      const dayLessons = weeklyLessons.filter(lesson => 
        format(new Date(lesson.start), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      );

      return [
        format(day, 'EEEE', { locale: tr }),
        format(day, 'd MMMM', { locale: tr }),
        dayLessons.map(lesson => 
          `${format(new Date(lesson.start), 'HH:mm')} - ${format(new Date(lesson.end), 'HH:mm')}`
        ).join('\n') || 'Ders Yok'
      ];
    });

    // Generate table
    autoTable(doc, {
      head: [['Gün', 'Tarih', 'Ders Saatleri']],
      body: tableData,
      startY: 55,
      styles: {
        font: "helvetica",
        fontSize: 10,
        cellPadding: 5,
      },
      headStyles: {
        fillColor: [26, 115, 232],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 40 },
        2: { cellWidth: 'auto' }
      }
    });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(128);
    const footerText = `${format(new Date(), 'd MMMM yyyy HH:mm', { locale: tr })} tarihinde oluşturuldu`;
    doc.text(footerText, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });

    // Save
    const fileName = `${student.name.toLowerCase().replace(/\s+/g, '-')}-haftalik-program-${format(today, 'yyyy-MM-dd')}.pdf`;
    doc.save(fileName);

    toast({
      title: "PDF oluşturuldu",
      description: `${fileName} başarıyla indirildi.`,
    });

    setSelectedStudentId("");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Share className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium leading-none mb-3">Haftalık Program Paylaş</h4>
          <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
            <SelectTrigger>
              <SelectValue placeholder="Öğrenci seçin" />
            </SelectTrigger>
            <SelectContent>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            className="w-full" 
            onClick={generatePDF}
            disabled={!selectedStudentId}
          >
            <Download className="h-4 w-4 mr-2" />
            PDF İndir
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}