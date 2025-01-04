import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { format } from "date-fns";
import { tr } from 'date-fns/locale';
import { Student, Lesson } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { pdfStyles, tableLayout } from "@/utils/pdfStyles";
import { calculatePdfStats, createTableBody } from "@/utils/pdfUtils";

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
  selectedDate: Date;
  startDate?: Date;
  endDate?: Date;
}

export function PdfReport({
  lessons,
  students,
  selectedStudent,
  selectedPeriod,
  selectedDate,
  startDate,
  endDate
}: PdfReportProps) {
  const { toast } = useToast();

  const generatePDF = () => {
    const { filteredLessons, totalHours, totalEarnings } = calculatePdfStats(
      lessons,
      students,
      selectedDate,
      selectedStudent,
      selectedPeriod,
      startDate,
      endDate
    );

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

    const tableBody = createTableBody(filteredLessons, students);

    const docDefinition = {
      pageMargins: [40, 60, 40, 60],
      header: {
        text: 'Ders Raporu',
        alignment: 'center',
        margin: [0, 20],
        fontSize: 24,
        bold: true,
        color: '#1a73e8'
      },
      footer: function(currentPage: number, pageCount: number) {
        return {
          text: currentPage.toString() + ' / ' + pageCount,
          alignment: 'center',
          margin: [0, 20]
        };
      },
      content: [
        {
          columns: [
            {
              width: '*',
              stack: [
                { text: periodText, style: 'subheader' },
                { text: `Öğrenci: ${studentName}`, style: 'subheader' },
              ]
            },
            {
              width: 'auto',
              stack: [
                { 
                  text: `Toplam Ders: ${totalHours} Saat`, 
                  style: 'totalInfo',
                  alignment: 'right'
                },
                { 
                  text: `Toplam Kazanç: ${totalEarnings.toLocaleString('tr-TR', { 
                    style: 'currency', 
                    currency: 'TRY',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}`, 
                  style: 'totalInfo',
                  alignment: 'right'
                },
              ]
            }
          ],
          columnGap: 20,
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
          },
          layout: tableLayout
        }
      ],
      styles: pdfStyles,
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