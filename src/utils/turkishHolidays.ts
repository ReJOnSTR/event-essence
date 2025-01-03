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

export const isHoliday = (inputDate: Date | string): Holiday | undefined => {
  // Ensure we're working with a Date object
  const date = inputDate instanceof Date ? inputDate : new Date(inputDate);
  
  // Validate the date
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    console.error('Invalid date provided to isHoliday:', inputDate);
    return undefined;
  }

  // Check custom holidays from settings
  try {
    const customHolidays = JSON.parse(localStorage.getItem('holidays') || '[]');
    const customHoliday = customHolidays.find((holiday: { date: string }) => 
      new Date(holiday.date).toDateString() === date.toDateString()
    );
    
    if (customHoliday) {
      return { name: "Özel Tatil", date: new Date(customHoliday.date) };
    }
  } catch (error) {
    console.error('Error parsing custom holidays:', error);
  }

  // Check official holidays
  const holidays = getTurkishHolidays(getYear(date));
  return holidays.find(holiday => 
    holiday.date.getDate() === date.getDate() && 
    holiday.date.getMonth() === date.getMonth()
  );
};