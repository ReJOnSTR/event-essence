import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Student } from "@/types/calendar";
import { Lesson } from "@/types/calendar";
import { 
  useCalculatePeriodHours,
  useCalculatePeriodEarnings,
  PeriodHours,
  PeriodEarnings
} from "@/utils/reportCalculations";

interface StatsCardsProps {
  lessons: Lesson[];
  students: Student[];
  selectedDate: Date;
  selectedStudent: string;
  startDate?: Date;
  endDate?: Date;
}

export default function StatsCards({
  lessons,
  students,
  selectedDate,
  selectedStudent,
  startDate,
  endDate,
}: StatsCardsProps) {
  const hours: PeriodHours = useCalculatePeriodHours(
    lessons,
    selectedDate,
    selectedStudent,
    startDate,
    endDate
  );

  const earnings: PeriodEarnings = useCalculatePeriodEarnings(
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

      {startDate && endDate && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seçili Dönem</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hours.custom || 0} Saat</div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(earnings.custom || 0)}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}