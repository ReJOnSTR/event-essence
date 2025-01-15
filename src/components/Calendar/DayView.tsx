import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface DayViewProps {
  date: Date;
  events: any[];
}

export default function DayView({ date, events }: DayViewProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="text-lg font-semibold mb-4">
        {format(date, 'EEEE, d MMMM yyyy', { locale: tr })}
      </div>
      <div className="flex-1 overflow-auto">
        {events.map((event) => (
          <div key={event.id} className="mb-2 p-2 bg-background border rounded">
            <div className="font-medium">{event.title}</div>
            <div className="text-sm text-muted-foreground">
              {format(new Date(event.start), 'HH:mm')} - {format(new Date(event.end), 'HH:mm')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}