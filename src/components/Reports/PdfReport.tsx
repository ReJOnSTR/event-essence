import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Student, Lesson } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";

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
    // Initialize jsPDF with Turkish font support
    const doc = new jsPDF();
    doc.addFont("https://fonts.cdnfonts.com/css/dejavu-sans", "DejaVu Sans", "normal");
    doc.setFont("DejaVu Sans");
    
    const pageWidth = doc.internal.pageSize.width;

    // Header
    doc.setFontSize(20);
    doc.text("Ders Raporu", pageWidth / 2, 20, { align: "center" });

    // Period Info
    doc.setFontSize(12);
    let periodText = "";
    if (startDate && endDate) {
      periodText = `${format(startDate, 'd MMMM yyyy', { locale: tr })} - ${format(endDate, 'd MMMM yyyy', { locale: tr })}`;
    } else {
      periodText = `${selectedPeriod} Raporu`;
    }
    doc.text(periodText, pageWidth / 2, 30, { align: "center" });

    // Student Info
    const studentName = selectedStudent === "all" 
      ? "Tüm Öğrenciler" 
      : students.find(s => s.id === selectedStudent)?.name || "Bilinmeyen Öğrenci";
    doc.text(`Öğrenci: ${studentName}`, 20, 40);

    // Summary
    doc.text(`Toplam Ders Saati: ${totalHours}`, 20, 50);
    doc.text(`Toplam Kazanç: ${totalEarnings.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}`, 20, 60);

    // Table
    const tableData = lessons.map(lesson => {
      const student = students.find(s => s.id === lesson.studentId);
      return [
        format(new Date(lesson.start), 'd MMMM yyyy', { locale: tr }),
        `${format(new Date(lesson.start), 'HH:mm')} - ${format(new Date(lesson.end), 'HH:mm')}`,
        student?.name || "Bilinmeyen Öğrenci",
        student?.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }) || "0 ₺"
      ];
    });

    autoTable(doc, {
      head: [['Tarih', 'Saat', 'Öğrenci', 'Ücret']],
      body: tableData,
      startY: 70,
      styles: {
        font: "DejaVu Sans",
        fontSize: 10,
        cellPadding: 5,
        valign: 'middle',
        halign: 'center'
      },
      headStyles: {
        fillColor: [26, 115, 232],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });

    // Footer with page numbers
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.text(
        `Sayfa ${i} / ${totalPages}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
    }

    // Save
    const fileName = `ders-raporu-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
    doc.save(fileName);

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