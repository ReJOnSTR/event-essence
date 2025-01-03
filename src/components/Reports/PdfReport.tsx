import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { format } from "date-fns";
import { tr } from 'date-fns/locale';
import { Student, Lesson } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// Initialize pdfMake with fonts
(window as any).pdfMake = pdfMake;
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;
pdfMake.fonts = {
  Roboto: {
    normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Regular.ttf',
    bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Medium.ttf',
    italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Italic.ttf',
    bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-MediumItalic.ttf'
  }
};

interface PdfReportProps {
  lessons: Lesson[];
  students: Student[];
  selectedStudent: string;
  selectedPeriod: string;
  totalHours: number;
  totalEarnings: number;
  startDate?: Date;
  endDate?: Date;
}

export function PdfReport({
  lessons,
  students,
  selectedStudent,
  selectedPeriod,
  totalHours,
  totalEarnings,
  startDate,
  endDate
}: PdfReportProps) {
  const { toast } = useToast();

  const generatePDF = () => {
    // Period Info
    let periodText = "";
    if (startDate && endDate) {
      periodText = `${format(startDate, 'd MMMM yyyy', { locale: tr })} - ${format(endDate, 'd MMMM yyyy', { locale: tr })}`;
    } else {
      const periodMap: { [key: string]: string } = {
        'weekly': 'Haftalık',
        'monthly': 'Aylık',
        'yearly': 'Yıllık',
        'custom': 'Özel'
      };
      periodText = `${periodMap[selectedPeriod] || selectedPeriod} Raporu`;
    }

    // Student Info
    const studentName = selectedStudent === "all" 
      ? "Tüm Öğrenciler" 
      : students.find(s => s.id === selectedStudent)?.name || "Bilinmeyen Öğrenci";

    const tableBody = lessons.map(lesson => {
      const student = students.find(s => s.id === lesson.studentId);
      return [
        { text: format(new Date(lesson.start), 'd MMMM yyyy', { locale: tr }), style: 'tableCell' },
        { text: `${format(new Date(lesson.start), 'HH:mm')} - ${format(new Date(lesson.end), 'HH:mm')}`, style: 'tableCell' },
        { text: student?.name || "Bilinmeyen Öğrenci", style: 'tableCell' },
        { 
          text: (student?.price || 0).toLocaleString('tr-TR', { 
            style: 'currency', 
            currency: 'TRY',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }), 
          style: 'tableCell' 
        }
      ];
    });

    const docDefinition = {
      content: [
        { text: 'Ders Raporu', style: 'header' },
        { text: periodText, style: 'subheader', margin: [0, 10, 0, 5] },
        { text: `Öğrenci: ${studentName}`, style: 'subheader', margin: [0, 0, 0, 5] },
        { text: `Toplam Ders Saati: ${totalHours}`, style: 'info', margin: [0, 0, 0, 5] },
        { 
          text: `Toplam Kazanç: ${totalEarnings.toLocaleString('tr-TR', { 
            style: 'currency', 
            currency: 'TRY',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}`, 
          style: 'info',
          margin: [0, 0, 0, 20]
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', '*', 'auto'],
            body: [
              [
                { text: 'Tarih', style: 'tableHeader' },
                { text: 'Saat', style: 'tableHeader' },
                { text: 'Öğrenci', style: 'tableHeader' },
                { text: 'Ücret', style: 'tableHeader' }
              ],
              ...tableBody
            ]
          }
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
          bold: true
        },
        info: {
          fontSize: 12
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
        }
      },
      defaultStyle: {
        font: 'Roboto'
      }
    };

    const fileName = `ders-raporu-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
    
    pdfMake.createPdf(docDefinition).download(fileName);

    toast({
      title: "PDF raporu oluşturuldu",
      description: `${fileName} başarıyla indirildi.`,
    });
  };

  return (
    <Button
      onClick={generatePDF}
      className="fixed bottom-4 right-4 z-50 shadow-lg"
      size="lg"
    >
      <FileDown className="w-5 h-5 mr-2" />
      PDF İndir
    </Button>
  );
}
