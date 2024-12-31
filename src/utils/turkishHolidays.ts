import { isWithinInterval, getYear } from "date-fns";

export interface Holiday {
  name: string;
  date: Date;
}

export const getTurkishHolidays = (year: number): Holiday[] => {
  return [
    { name: "Yılbaşı", date: new Date(year, 0, 1) },
    { name: "Ulusal Egemenlik ve Çocuk Bayramı", date: new Date(year, 3, 23) },
    { name: "Emek ve Dayanışma Günü", date: new Date(year, 4, 1) },
    { name: "Atatürk'ü Anma, Gençlik ve Spor Bayramı", date: new Date(year, 4, 19) },
    { name: "Demokrasi ve Milli Birlik Günü", date: new Date(year, 6, 15) },
    { name: "Zafer Bayramı", date: new Date(year, 7, 30) },
    { name: "Cumhuriyet Bayramı", date: new Date(year, 9, 29) },
  ];
};

export const isHoliday = (date: Date): Holiday | undefined => {
  // Check custom holidays from settings
  const customHolidays = JSON.parse(localStorage.getItem('holidays') || '[]');
  const customHoliday = customHolidays.find((holiday: { date: string }) => 
    new Date(holiday.date).toDateString() === date.toDateString()
  );
  
  if (customHoliday) {
    return { name: "Özel Tatil", date: new Date(customHoliday.date) };
  }

  // Check official holidays
  const holidays = getTurkishHolidays(getYear(date));
  return holidays.find(holiday => 
    date.getDate() === holiday.date.getDate() && 
    date.getMonth() === holiday.date.getMonth()
  );
};