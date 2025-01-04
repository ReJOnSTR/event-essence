import { format, parse, isValid } from 'date-fns';
import { tr } from 'date-fns/locale';

export const formatDate = (date: Date): string => {
  return format(date, 'dd.MM.yyyy', { locale: tr });
};

export const parseDate = (dateString: string): Date | null => {
  const parsedDate = parse(dateString, 'dd.MM.yyyy', new Date());
  return isValid(parsedDate) ? parsedDate : null;
};

export const validateDate = (date: Date | null): date is Date => {
  return date !== null && isValid(date);
};