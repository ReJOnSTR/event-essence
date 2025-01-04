import { Student } from "@/types/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StudentCardProps {
  student: Student;
  onClick: (student: Student) => void;
}

export default function StudentCard({ student, onClick }: StudentCardProps) {
  return (
    <Card 
      className={cn(
        "flex flex-col cursor-pointer transition-all hover:ring-2 hover:ring-primary",
        "transform hover:scale-[1.02] active:scale-[0.98]"
      )}
      onClick={() => onClick(student)}
    >
      <CardContent className="flex-1 p-4 sm:p-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div 
            className={cn(
              "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center",
              "text-white text-base sm:text-xl font-semibold shrink-0"
            )}
            style={{ backgroundColor: student.color }}
          >
            {student.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "text-base sm:text-lg font-semibold truncate",
              "leading-tight"
            )}>
              {student.name}
            </h3>
            <p className={cn(
              "text-sm text-muted-foreground mt-0.5",
              "truncate"
            )}>
              Ders Ücreti: {student.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}