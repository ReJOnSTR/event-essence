import { FileBarChart, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { tr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PeriodHours, PeriodEarnings } from "@/utils/reportCalculations";
import { cn } from "@/lib/utils";

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
  const cardClassName = "min-w-[240px] flex-1";
  const headerClassName = "flex flex-row items-center justify-between space-y-0 pb-2";
  const titleClassName = "text-sm font-medium";
  const contentClassName = "pt-0";
  const valueClassName = "text-xl sm:text-2xl font-bold";
  const subtextClassName = "text-xs text-muted-foreground mt-1";

  if (selectedPeriod === "custom" && startDate && endDate) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <Card className={cardClassName}>
          <CardHeader className={headerClassName}>
            <CardTitle className={titleClassName}>Seçili Tarih Aralığı Ders Sayısı</CardTitle>
            <FileBarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className={contentClassName}>
            <div className={valueClassName}>{hours.custom} Ders</div>
            <p className={subtextClassName}>
              {format(startDate, "d MMMM yyyy", { locale: tr })} - {format(endDate, "d MMMM yyyy", { locale: tr })}
            </p>
          </CardContent>
        </Card>

        <Card className={cardClassName}>
          <CardHeader className={headerClassName}>
            <CardTitle className={titleClassName}>Seçili Tarih Aralığı Kazanç</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className={contentClassName}>
            <div className={valueClassName}>{earnings.custom?.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</div>
            <p className={subtextClassName}>
              {format(startDate, "d MMMM yyyy", { locale: tr })} - {format(endDate, "d MMMM yyyy", { locale: tr })}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      <Card className={cardClassName}>
        <CardHeader className={headerClassName}>
          <CardTitle className={titleClassName}>Haftalık Ders Sayısı</CardTitle>
          <FileBarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className={contentClassName}>
          <div className={valueClassName}>{hours.weekly} Ders</div>
          <p className={subtextClassName}>
            {format(selectedDate, "'Hafta' w", { locale: tr })}
          </p>
        </CardContent>
      </Card>

      <Card className={cardClassName}>
        <CardHeader className={headerClassName}>
          <CardTitle className={titleClassName}>Aylık Ders Sayısı</CardTitle>
          <FileBarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className={contentClassName}>
          <div className={valueClassName}>{hours.monthly} Ders</div>
          <p className={subtextClassName}>
            {format(selectedDate, "MMMM yyyy", { locale: tr })}
          </p>
        </CardContent>
      </Card>

      <Card className={cardClassName}>
        <CardHeader className={headerClassName}>
          <CardTitle className={titleClassName}>Yıllık Ders Sayısı</CardTitle>
          <FileBarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className={contentClassName}>
          <div className={valueClassName}>{hours.yearly} Ders</div>
          <p className={subtextClassName}>
            {format(selectedDate, "yyyy", { locale: tr })}
          </p>
        </CardContent>
      </Card>

      <Card className={cardClassName}>
        <CardHeader className={headerClassName}>
          <CardTitle className={titleClassName}>Haftalık Kazanç</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className={contentClassName}>
          <div className={valueClassName}>{earnings.weekly.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</div>
          <p className={subtextClassName}>
            {format(selectedDate, "'Hafta' w", { locale: tr })}
          </p>
        </CardContent>
      </Card>

      <Card className={cardClassName}>
        <CardHeader className={headerClassName}>
          <CardTitle className={titleClassName}>Aylık Kazanç</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className={contentClassName}>
          <div className={valueClassName}>{earnings.monthly.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</div>
          <p className={subtextClassName}>
            {format(selectedDate, "MMMM yyyy", { locale: tr })}
          </p>
        </CardContent>
      </Card>

      <Card className={cardClassName}>
        <CardHeader className={headerClassName}>
          <CardTitle className={titleClassName}>Yıllık Kazanç</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className={contentClassName}>
          <div className={valueClassName}>{earnings.yearly.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</div>
          <p className={subtextClassName}>
            {format(selectedDate, "yyyy", { locale: tr })}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}