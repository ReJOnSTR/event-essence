import { FileBarChart, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { tr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PeriodHours, PeriodEarnings } from "@/utils/reportCalculations";

interface StatsCardsProps {
  hours: PeriodHours;
  earnings: PeriodEarnings;
  selectedDate: Date;
  startDate?: Date;
  endDate?: Date;
  selectedPeriod: "weekly" | "monthly" | "yearly" | "custom";
}

export function StatsCards({ 
  hours, 
  earnings, 
  selectedDate,
  startDate,
  endDate,
  selectedPeriod
}: StatsCardsProps) {
  if (selectedPeriod === "custom" && startDate && endDate) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seçili Tarih Aralığı Ders Saati</CardTitle>
            <FileBarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hours.custom} Saat</div>
            <p className="text-xs text-muted-foreground">
              {format(startDate, "d MMMM yyyy", { locale: tr })} - {format(endDate, "d MMMM yyyy", { locale: tr })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seçili Tarih Aralığı Kazanç</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{earnings.custom?.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</div>
            <p className="text-xs text-muted-foreground">
              {format(startDate, "d MMMM yyyy", { locale: tr })} - {format(endDate, "d MMMM yyyy", { locale: tr })}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Haftalık Ders Saati</CardTitle>
          <FileBarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{hours.weekly} Saat</div>
          <p className="text-xs text-muted-foreground">
            {format(selectedDate, "'Hafta' w", { locale: tr })}
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
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

      <Card className="md:col-span-2">
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

      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Haftalık Kazanç</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{earnings.weekly.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</div>
          <p className="text-xs text-muted-foreground">
            {format(selectedDate, "'Hafta' w", { locale: tr })}
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Aylık Kazanç</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{earnings.monthly.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</div>
          <p className="text-xs text-muted-foreground">
            {format(selectedDate, "MMMM yyyy", { locale: tr })}
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Yıllık Kazanç</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{earnings.yearly.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</div>
          <p className="text-xs text-muted-foreground">
            {format(selectedDate, "yyyy", { locale: tr })}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}