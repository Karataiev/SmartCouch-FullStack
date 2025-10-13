import {parse, format} from 'date-fns';
import {uk} from 'date-fns/locale';

// "22 вересня 2025 р." -- Input data
export const useConvertDate = () => {
  const convertUkrDateToISO = dateStr => {
    const parsedDate = parse(dateStr, "d MMMM yyyy 'р.'", new Date(), {
      locale: uk,
    });
    return format(parsedDate, 'yyyy-MM-dd');
  };

  return {convertUkrDateToISO};
};
// 👉 "2025-09-22" -- Output data
