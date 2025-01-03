import { Button } from "@/components/ui/button";
import { Share, Download } from "lucide-react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { tr } from 'date-fns/locale';
import { Student, Lesson } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
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

// PDF make fonts tanımlaması
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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

    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    // Filter lessons for the current week and student
    const weeklyLessons = lessons.filter(lesson => {
      const lessonDate = new Date(lesson.start);
      return lesson.studentId === selectedStudentId &&
             lessonDate >= weekStart &&
             lessonDate <= weekEnd;
    });

    // Prepare table data
    const tableBody = weekDays.map(day => {
      const dayLessons = weeklyLessons.filter(lesson => 
        format(new Date(lesson.start), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      );

      return [
        { text: format(day, 'EEEE', { locale: tr }), style: 'tableCell' },
        { text: format(day, 'd MMMM', { locale: tr }), style: 'tableCell' },
        { 
          text: dayLessons.map(lesson => 
            `${format(new Date(lesson.start), 'HH:mm')} - ${format(new Date(lesson.end), 'HH:mm')}`
          ).join('\n') || 'Ders Yok',
          style: 'tableCell'
        }
      ];
    });

    const dateRange = `${format(weekStart, 'd MMMM yyyy', { locale: tr })} - ${format(weekEnd, 'd MMMM yyyy', { locale: tr })}`;

    const docDefinition = {
      content: [
        { text: 'Haftalık Ders Programı', style: 'header' },
        { text: `Öğrenci: ${student.name}`, style: 'subheader', margin: [0, 10, 0, 5] },
        { text: dateRange, style: 'subheader', margin: [0, 0, 0, 20] },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', '*'],
            body: [
              [
                { text: 'Gün', style: 'tableHeader' },
                { text: 'Tarih', style: 'tableHeader' },
                { text: 'Ders Saatleri', style: 'tableHeader' }
              ],
              ...tableBody
            ]
          }
        },
        {
          text: `${format(new Date(), 'd MMMM yyyy HH:mm', { locale: tr })} tarihinde oluşturuldu`,
          style: 'footer',
          margin: [0, 20, 0, 0]
        }
      ],
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          alignment: 'center'
        },
        subheader: {
          fontSize: 14,
          bold: false
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          fillColor: '#1a73e8',
          color: '#ffffff',
          alignment: 'center'
        },
        tableCell: {
          fontSize: 11,
          alignment: 'center'
        },
        footer: {
          fontSize: 10,
          color: '#666666',
          alignment: 'center'
        }
      },
      defaultStyle: {
        font: 'Roboto'
      }
    };

    const fileName = `${student.name.toLowerCase().replace(/\s+/g, '-')}-haftalik-program-${format(today, 'yyyy-MM-dd')}.pdf`;
    
    pdfMake.createPdf(docDefinition).download(fileName);

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