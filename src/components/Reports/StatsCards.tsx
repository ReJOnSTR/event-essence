import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Student, Lesson } from "@/types/calendar";
import { 
  useCalculatePeriodHours,
  useCalculatePeriodEarnings,
} from "@/utils/reportCalculations";

interface StatsCardsProps {
  lessons: Lesson[];
  students: Student[];
  selectedDate: Date;
  selectedStudent: string;
  startDate?: Date;
  endDate?: Date;
}

export function StatsCards({
  lessons,
  students,
  selectedDate,
  selectedStudent,
  startDate,
  endDate,
}: StatsCardsProps) {
  const hours = useCalculatePeriodHours(
    lessons,
    selectedDate,
    selectedStudent,
    startDate,
    endDate
  );

  const earnings = useCalculatePeriodEarnings(
    lessons,
    selectedDate,
    selectedStudent,
    students,
    startDate,
    endDate
  );

  const formatCurrency = (value: number) => {
    return value.toLocaleString('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bu Hafta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{hours.weekly} Saat</div>
          <p className="text-xs text-muted-foreground mt-1">
            {formatCurrency(earnings.weekly)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bu Ay</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{hours.monthly} Saat</div>
          <p className="text-xs text-muted-foreground mt-1">
            {formatCurrency(earnings.monthly)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bu Yıl</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{hours.yearly} Saat</div>
          <p className="text-xs text-muted-foreground mt-1">
            {formatCurrency(earnings.yearly)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Seçili Dönem</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {hours.custom} Saat
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {formatCurrency(earnings.custom)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}