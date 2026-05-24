import {
  addMonths,
  endOfDay,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isWeekend,
  parseISO,
  startOfDay,
  subDays,
} from "date-fns";

const DEFAULT_SALARY_DAY = 26;

/** Indian bank holidays (YYYY-MM-DD). Extend in settings or here. */
export const DEFAULT_HOLIDAYS: string[] = [
  "2025-01-26",
  "2025-03-14",
  "2025-03-31",
  "2025-04-14",
  "2025-04-18",
  "2025-05-01",
  "2025-08-15",
  "2025-08-27",
  "2025-10-02",
  "2025-10-21",
  "2025-10-22",
  "2025-11-05",
  "2025-12-25",
  "2026-01-26",
  "2026-03-03",
  "2026-03-26",
  "2026-03-31",
  "2026-04-03",
  "2026-04-14",
  "2026-05-01",
  "2026-05-28",
  "2026-08-15",
  "2026-10-02",
  "2026-10-20",
  "2026-11-08",
  "2026-11-24",
  "2026-12-25",
];

function toDateKey(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

function isHoliday(d: Date, holidays: Set<string>): boolean {
  return holidays.has(toDateKey(d));
}

function isWorkingDay(d: Date, holidays: Set<string>): boolean {
  return !isWeekend(d) && !isHoliday(d, holidays);
}

/** Last working day on or before `date` (salary credited here if 26th is off). */
export function getSalaryCreditDate(
  year: number,
  month: number,
  salaryDay = DEFAULT_SALARY_DAY,
  extraHolidays: string[] = []
): Date {
  const holidays = new Set([...DEFAULT_HOLIDAYS, ...extraHolidays]);
  let d = new Date(year, month - 1, Math.min(salaryDay, 28));
  // Handle months with fewer days than salaryDay
  const lastDay = new Date(year, month, 0).getDate();
  d = new Date(year, month - 1, Math.min(salaryDay, lastDay));

  while (!isWorkingDay(d, holidays)) {
    d = subDays(d, 1);
  }
  return startOfDay(d);
}

export interface SalaryPeriodRange {
  start: Date;
  end: Date;
  label: string;
  creditDate: Date;
}

export function getPeriodForDate(
  date: Date,
  salaryDay = DEFAULT_SALARY_DAY,
  extraHolidays: string[] = []
): SalaryPeriodRange {
  const d = startOfDay(date);
  let y = d.getFullYear();
  let m = d.getMonth() + 1;

  let credit = getSalaryCreditDate(y, m, salaryDay, extraHolidays);

  if (isBefore(d, credit)) {
    m -= 1;
    if (m < 1) {
      m = 12;
      y -= 1;
    }
    credit = getSalaryCreditDate(y, m, salaryDay, extraHolidays);
  }

  let nextY = credit.getMonth() === 11 ? credit.getFullYear() + 1 : credit.getFullYear();
  let nextM = credit.getMonth() === 11 ? 1 : credit.getMonth() + 2;
  const nextCredit = getSalaryCreditDate(nextY, nextM, salaryDay, extraHolidays);

  const start = credit;
  const end = endOfDay(subDays(nextCredit, 1));

  const label = `${format(start, "d MMM yyyy")} – ${format(end, "d MMM yyyy")}`;

  return { start, end, label, creditDate: credit };
}

export function listRecentPeriods(
  count: number,
  salaryDay = DEFAULT_SALARY_DAY,
  extraHolidays: string[] = []
): SalaryPeriodRange[] {
  const periods: SalaryPeriodRange[] = [];
  let cursor = new Date();

  for (let i = 0; i < count + 2; i++) {
    const p = getPeriodForDate(cursor, salaryDay, extraHolidays);
    const key = p.label;
    if (!periods.some((x) => x.label === key)) {
      periods.push(p);
    }
    cursor = subDays(p.start, 1);
    if (periods.length >= count) break;
  }

  return periods.slice(0, count);
}

export function isDateInPeriod(
  date: Date,
  start: Date,
  end: Date
): boolean {
  const d = startOfDay(date);
  return (
    (isSameDay(d, start) || isAfter(d, start)) &&
    (isSameDay(d, end) || isBefore(d, endOfDay(end)))
  );
}

export function parsePeriodDates(
  startISO: string,
  endISO: string
): { start: Date; end: Date } {
  return { start: parseISO(startISO), end: parseISO(endISO) };
}
