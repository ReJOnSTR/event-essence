import { FileBarChart } from "lucide-react";
import { format } from "date-fns";
import { tr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PeriodHours } from "@/utils/reportCalculations";

interface StatsCardsProps {
  hours: PeriodHours;
  selectedDate: Date;
}

export function StatsCards({ hours, selectedDate }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Haftalık Ders Saati</CardTitle>
          <FileBarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{hours.weekly} Saat</div>
          <p className="text-xs text-muted-foreground">
            {format(selectedDate, "'Hafta' w, MMMM yyyy", { locale: tr })}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Aylık Ders Saati</CardTitle>
          <FileBarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{hours.monthly} Saat</div>
          <p className="text-xs text-muted-foreground">
            {format(selectedDate, "MMMM yyyy", { locale: tr })}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Yıllık Ders Saati</CardTitle>
          <FileBarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{hours.yearly} Saat</div>
          <p className="text-xs text-muted-foreground">
            {format(selectedDate, "yyyy", { locale: tr })}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}