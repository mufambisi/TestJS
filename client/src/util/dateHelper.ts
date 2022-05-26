import { parseISO, isValid, format } from "date-fns";

export function parseDate(
  dateString: string | null | undefined
): Date | undefined {
  if (!dateString || dateString.trim().length === 0) {
    return undefined;
  }
  const parsedDate = parseISO(dateString);
  if (isValid(parsedDate)) {
    return parsedDate;
  } else {
    return undefined;
  }
}

export function formatDate(
  date: Date | undefined,
  formatString: string
): string {
  if (!date) {
    return "";
  }
  return format(date, formatString);
}
