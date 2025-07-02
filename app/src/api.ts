import axios from 'axios';
import { type Dashboard, type Habit } from './types';

const api = axios.create({
  baseURL: 'http://203.161.41.83:8000',
  timeout: 5000
});

export async function fetchDashboard(): Promise<Dashboard> {
  const { data } = await api.get<Dashboard>('/dashboard');
  return data;
}

export async function createHabit(habit: Omit<Habit, 'id'>): Promise<Dashboard> {
  const { data } = await api.post<Dashboard>('/habits', habit);
  return data;
}

export async function editHabit(id: number, habit: Omit<Habit, 'id'>): Promise<Dashboard> {
  const { data } = await api.put<Dashboard>(`/habits/${id}`, habit);
  return data;
}

export async function updateRecord(id: number, value: number): Promise<Dashboard> {
  const { data } = await api.put<Dashboard>(`/records/${id}`, { value });
  return data;
}

export async function checkRollover() {
  const { data } = await api.get<boolean>(`/rollover/check`)
  return data;
}


export async function performRollover() {
  const { data } = await api.post<Dashboard>(`/rollover`);
  return data;
}
