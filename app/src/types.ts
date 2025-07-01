export type HabitType = 'boolean' | 'numeric';
export type Polarity = 'good' | 'bad';
export type Period = 'day' | 'week' | 'month' | 'year';

export interface Habit {
  id: number;
  name: string;
  type: HabitType;
  polarity: Polarity;
  start_value: number;
  target: number;
  period: Period;
  active: boolean;
}

export interface Record {
  id: number;
  habit_id: number;
  date_start: string; // ISO yyyy-mm-dd
  period: Period;
  value: number;
  locked: boolean;
}

export interface Dashboard {
  habits: Habit[];
  records: Record[];
}
