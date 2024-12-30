import { FileBarChart } from "lucide-react";
import { format } from "date-fns";
import { tr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PeriodHours } from "@/utils/reportCalculations";

interface StatsCardsProps {
  hours: number;
  startDate: Date;
  endDate: Date;
}

export function StatsCards({ hours, startDate, endDate }: StatsCardsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Toplam Ders Saati</CardTitle>
        <FileBarChart className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{hours} Saat</div>
        <p className="text-xs text-muted-foreground">
          {format(startDate, "d MMMM yyyy", { locale: tr })} - {format(endDate, "d MMMM yyyy", { locale: tr })}
        </p>
      </CardContent>
    </Card>
  );
}