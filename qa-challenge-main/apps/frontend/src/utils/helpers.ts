import { format, parseISO } from 'date-fns';

// Group an array of objects by a property
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, currentValue) => {
    const keyValue = String(currentValue[key]);
    (result[keyValue] = result[keyValue] || []).push(currentValue);
    return result;
  }, {} as Record<string, T[]>);
}

// Format a date string to a human-readable format
export function formatDate(dateString: string, formatStr: string = 'MMM d, yyyy'): string {
  try {
    return format(parseISO(dateString), formatStr);
  } catch (error) {
    return dateString;
  }
}

// Get earliest check-in date and latest check-out date from a list of bookings
export function getDateRange(bookings: { checkInDate: string; checkOutDate: string }[]) {
  if (!bookings || bookings.length === 0) {
    return { startDate: '29 Jun, 2025', endDate: '05 Jul, 2025' }; //hardcoded for now
  }
  
  const checkInDates = bookings.map(b => new Date(b.checkInDate));
  const checkOutDates = bookings.map(b => new Date(b.checkOutDate));
  
  const startDate = new Date(Math.min(...checkInDates.map(d => d.getTime())));
  const endDate = new Date(Math.max(...checkOutDates.map(d => d.getTime())));
  
  return { 
    startDate: format(startDate, 'MMM d, yyyy'),
    endDate: format(endDate, 'MMM d, yyyy')
  };
}

// Format agreement type for display
export function formatAgreementType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
} 