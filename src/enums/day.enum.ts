export enum Day {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
}

export const DayLabels: Record<Day, string> = {
  [Day.MONDAY]: 'Lunes',
  [Day.TUESDAY]: 'Martes',
  [Day.WEDNESDAY]: 'Miércoles',
  [Day.THURSDAY]: 'Jueves',
  [Day.FRIDAY]: 'Viernes',
  [Day.SATURDAY]: 'Sábado',
};

export const getDayLabel = (day: Day | string): string => {
  if (!day || day === '') return 'Sin día';
  if (isValidDay(day)) {
    return DayLabels[day];
  }
  return 'Día desconocido';
};

export const DayOptions = Object.entries(DayLabels).map(([key, label]) => ({
  value: key as Day,
  label,
}));

export const isValidDay = (value: string): value is Day => {
  return Object.values(Day).includes(value as Day);
};
