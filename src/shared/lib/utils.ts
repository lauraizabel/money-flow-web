import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateFromBackend(dateString: string): string {
  const dateOnly = dateString.split('T')[0];
  const [year, month, day] = dateOnly.split('-');
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toLocaleDateString("pt-BR");
}

export function formatDateForChart(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  const dateOnly = dateString.split('T')[0];
  const [year, month, day] = dateOnly.split('-');
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toLocaleDateString("pt-BR", options);
}
