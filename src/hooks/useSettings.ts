import { useState, useEffect } from "react";
import { WeeklyWorkingHours } from "@/types/calendar";

const defaultWorkingHours: WeeklyWorkingHours = {
  monday: { start: "09:00", end: "17:00", enabled: true },
  tuesday: { start: "09:00", end: "17:00", enabled: true },
  wednesday: { start: "09:00", end: "17:00", enabled: true },
  thursday: { start: "09:00", end: "17:00", enabled: true },
  friday: { start: "09:00", end: "17:00", enabled: true },
  saturday: { start: "09:00", end: "17:00", enabled: false },
  sunday: { start: "09:00", end: "17:00", enabled: false },
};

export const useSettings = () => {
  const [workingHours, setWorkingHours] = useState<WeeklyWorkingHours>(() => {
    const savedHours = localStorage.getItem('workingHours');
    return savedHours ? JSON.parse(savedHours) : defaultWorkingHours;
  });

  const [allowWorkOnHolidays, setAllowWorkOnHolidays] = useState(() => {
    return localStorage.getItem('allowWorkOnHolidays') === 'true';
  });

  const [customHolidays, setCustomHolidays] = useState<Date[]>(() => {
    const savedHolidays = localStorage.getItem('customHolidays');
    return savedHolidays ? JSON.parse(savedHolidays).map((h: { date: string }) => new Date(h.date)) : [];
  });

  const updateWorkingHours = (newHours: WeeklyWorkingHours) => {
    setWorkingHours(newHours);
    localStorage.setItem('workingHours', JSON.stringify(newHours));
  };

  const updateAllowWorkOnHolidays = (allow: boolean) => {
    setAllowWorkOnHolidays(allow);
    localStorage.setItem('allowWorkOnHolidays', allow.toString());
  };

  const updateCustomHolidays = (dates: Date[]) => {
    const holidays = dates.map(date => ({
      date: date,
      description: "Özel Tatil"
    }));
    setCustomHolidays(dates);
    localStorage.setItem('customHolidays', JSON.stringify(holidays));
  };

  return {
    workingHours,
    updateWorkingHours,
    allowWorkOnHolidays,
    updateAllowWorkOnHolidays,
    customHolidays,
    updateCustomHolidays,
  };
};