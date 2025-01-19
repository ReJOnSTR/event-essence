import React from 'react';
import { RecurrencePattern } from '@/types/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { addDays, format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface RecurrenceSettingsProps {
  value: RecurrencePattern | undefined;
  onChange: (pattern: RecurrencePattern | undefined) => void;
  startDate: Date;
}

const WEEKDAYS = [
  { label: 'Pazartesi', value: 1 },
  { label: 'Salı', value: 2 },
  { label: 'Çarşamba', value: 3 },
  { label: 'Perşembe', value: 4 },
  { label: 'Cuma', value: 5 },
  { label: 'Cumartesi', value: 6 },
  { label: 'Pazar', value: 0 },
];

export default function RecurrenceSettings({ value, onChange, startDate }: RecurrenceSettingsProps) {
  const handleFrequencyChange = (frequency: string) => {
    if (!frequency) {
      onChange(undefined);
      return;
    }

    onChange({
      frequency: frequency as RecurrencePattern['frequency'],
      interval: 1,
      daysOfWeek: frequency === 'weekly' ? [startDate.getDay()] : undefined,
    });
  };

  const handleIntervalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!value) return;
    onChange({
      ...value,
      interval: Math.max(1, parseInt(event.target.value) || 1),
    });
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (!value) return;
    onChange({
      ...value,
      endDate: date,
    });
  };

  const handleDayToggle = (day: number) => {
    if (!value) return;
    const currentDays = value.daysOfWeek || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day].sort();

    onChange({
      ...value,
      daysOfWeek: newDays,
    });
  };

  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <Label>Tekrar Sıklığı</Label>
        <Select
          value={value?.frequency || ''}
          onValueChange={handleFrequencyChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tekrar etmez" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tekrar etmez</SelectItem>
            <SelectItem value="daily">Günlük</SelectItem>
            <SelectItem value="weekly">Haftalık</SelectItem>
            <SelectItem value="monthly">Aylık</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {value && (
        <>
          <div className="space-y-2">
            <Label>Tekrar Aralığı</Label>
            <Input
              type="number"
              min="1"
              value={value.interval}
              onChange={handleIntervalChange}
            />
            <span className="text-sm text-muted-foreground">
              {value.frequency === 'daily' && 'gün'}
              {value.frequency === 'weekly' && 'hafta'}
              {value.frequency === 'monthly' && 'ay'}
            </span>
          </div>

          {value.frequency === 'weekly' && (
            <div className="space-y-2">
              <Label>Tekrar Günleri</Label>
              <div className="grid grid-cols-2 gap-2">
                {WEEKDAYS.map((day) => (
                  <div key={day.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${day.value}`}
                      checked={(value.daysOfWeek || []).includes(day.value)}
                      onCheckedChange={() => handleDayToggle(day.value)}
                    />
                    <label
                      htmlFor={`day-${day.value}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {day.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Bitiş Tarihi</Label>
            <DatePicker
              date={value.endDate}
              onSelect={handleEndDateChange}
              placeholder="Seçiniz"
              fromDate={addDays(startDate, 1)}
            />
          </div>
        </>
      )}
    </div>
  );
}