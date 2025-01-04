import { Student } from "@/types/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface StudentCardProps {
  student: Student;
  onClick: (student: Student) => void;
}

export default function StudentCard({ student, onClick }: StudentCardProps) {
  const isMobile = useIsMobile();
  
  return (
    <Card 
      className="flex flex-col cursor-pointer transition-all hover:ring-2 hover:ring-primary"
      onClick={() => onClick(student)}
    >
      <CardContent className={cn(
        "flex-1",
        isMobile ? "p-3" : "p-6"
      )}>
        <div className="flex items-center gap-3">
          <div 
            className={cn(
              "rounded-full flex items-center justify-center text-white font-semibold",
              isMobile ? "w-10 h-10 text-lg" : "w-12 h-12 text-xl"
            )}
            style={{ backgroundColor: student.color }}
          >
            {student.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-semibold truncate",
              isMobile ? "text-base" : "text-lg"
            )}>
              {student.name}
            </h3>
            <p className={cn(
              "text-gray-500 truncate",
              isMobile ? "text-xs" : "text-sm"
            )}>
              Ders Ücreti: {student.price.toLocaleString('tr-TR')} ₺
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}