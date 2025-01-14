import { getYear } from "date-fns";

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

export const isHoliday = (
  date: Date | string | number,
  customHolidays: Array<{ date: string; description?: string }> = []
): Holiday | undefined => {
  // Ensure we're working with a Date object
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Validate the date
  if (isNaN(dateObj.getTime())) {
    console.error('Invalid date provided to isHoliday:', date);
    return undefined;
  }
  
  // Check custom holidays from user settings
  const customHoliday = customHolidays.find(holiday => 
    new Date(holiday.date).toDateString() === dateObj.toDateString()
  );
  
  if (customHoliday) {
    return { 
      name: customHoliday.description || "Özel Tatil", 
      date: new Date(customHoliday.date) 
    };
  }

  // Check official holidays
  const holidays = getTurkishHolidays(getYear(dateObj));
  return holidays.find(holiday => 
    dateObj.getDate() === holiday.date.getDate() && 
    dateObj.getMonth() === holiday.date.getMonth()
  );
};