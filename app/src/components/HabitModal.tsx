import { useState } from 'react';
import { HabitType, Polarity, Period, Habit } from '../types';

interface Props {
  initial?: Habit;
  onSave: (data: Omit<Habit, 'id'>) => void;
  onClose: () => void;
}

export default function HabitModal({ initial, onSave, onClose }: Props) {
  const [form, setForm] = useState<Omit<Habit, 'id'>>(
    initial ?? {
      name: '',
      type: 'boolean',
      polarity: 'good',
      start_value: 0,
      target: 1,
      period: 'day',
      active: true
    }
  );

  function handleChange<K extends keyof typeof form>(key: K, val: typeof form[K]) {
    setForm({ ...form, [key]: val });
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-80 p-6">
        <h2 className="font-medium mb-4">
          {initial ? 'Edit Habit' : 'New Habit'}
        </h2>

        <label className="block mb-2">
          <span className="text-sm">Name</span>
          <input
            className="w-full border rounded px-2 py-1"
            value={form.name}
            onChange={e => handleChange('name', e.target.value)}
          />
        </label>

        <div className="flex space-x-2 mb-2">
          <label className="flex-1">
            <span className="text-sm">Type</span>
            <select
              className="w-full border rounded px-2 py-1"
              value={form.type}
              onChange={e => handleChange('type', e.target.value as HabitType)}
            >
              <option value="boolean">Boolean</option>
              <option value="numeric">Numeric</option>
            </select>
          </label>
          <label className="flex-1">
            <span className="text-sm">Polarity</span>
            <select
              className="w-full border rounded px-2 py-1"
              value={form.polarity}
              onChange={e => handleChange('polarity', e.target.value as Polarity)}
            >
              <option value="good">Good</option>
              <option value="bad">Bad</option>
            </select>
          </label>
        </div>

        <div className="flex space-x-2 mb-2">
          <label className="flex-1">
            <span className="text-sm">Start</span>
            <input
              type="number"
              className="w-full border rounded px-2 py-1"
              value={form.start_value}
              onChange={e => handleChange('start_value', Number(e.target.value))}
            />
          </label>
          <label className="flex-1">
            <span className="text-sm">Target</span>
            <input
              type="number"
              className="w-full border rounded px-2 py-1"
              value={form.target}
              onChange={e => handleChange('target', Number(e.target.value))}
            />
          </label>
        </div>

        <label className="block mb-4">
          <span className="text-sm">Period</span>
          <select
            className="w-full border rounded px-2 py-1"
            value={form.period}
            onChange={e => handleChange('period', e.target.value as Period)}
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </label>

        <div className="flex justify-end space-x-2">
          <button
            className="px-3 py-1 text-sm bg-gray-200 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
            onClick={() => onSave(form)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
