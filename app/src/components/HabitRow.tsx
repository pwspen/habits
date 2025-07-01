import { Habit, Record } from '../types';
import clsx from 'clsx';

interface Props {
  habit: Habit;
  record?: Record;
  editMode: boolean;
  onRecordChange: (newValue: number) => void;
  onEditHabit: () => void;
  onDeleteHabit: () => void;
}

export default function HabitRow({
  habit,
  record,
  editMode,
  onRecordChange,
  onEditHabit,
  onDeleteHabit
}: Props) {
  const value = record?.value ?? habit.start_value;
  const isGood = habit.polarity === 'good';

  const shade =
    habit.type === 'boolean'
      ? isGood
        ? 'bg-green-50'
        : 'bg-red-50'
      : value >= habit.target
      ? 'bg-green-50'
      : 'bg-red-50';

  return (
    <div
      className={clsx(
        'flex items-center justify-between px-4 py-3 border-b border-gray-200',
        shade
      )}
    >
      <span className="text-sm font-medium mr-4 flex-1">{habit.name}</span>

      {/* EDIT BUTTONS (only visible in edit mode) */}
      {editMode && (
        <div className="flex space-x-2 mr-2">
          <button
            title="Edit"
            className="text-blue-600 text-sm"
            onClick={onEditHabit}
          >
            ✎
          </button>
          <button
            title="Delete"
            className="text-red-600 text-sm"
            onClick={onDeleteHabit}
          >
            🗑
          </button>
        </div>
      )}

      {/* MAIN INTERACTION AREA */}
      {habit.type === 'boolean' ? (
        <>
          <button
            className={clsx(
              'w-8 h-8 rounded-full flex items-center justify-center border',
              isGood
                ? 'border-green-600 text-green-600'
                : 'border-gray-300 text-gray-400',
              value === 1 && isGood && 'bg-green-600 text-white',
              value === 0 && !isGood && 'bg-red-600 text-white'
            )}
            onClick={() => onRecordChange(1)}
          >
            ✓
          </button>
          <button
            className={clsx(
              'w-8 h-8 rounded-full flex items-center justify-center border ml-2',
              !isGood
                ? 'border-red-600 text-red-600'
                : 'border-gray-300 text-gray-400',
              value === 1 && !isGood && 'bg-red-600 text-white',
              value === 0 && isGood && 'bg-green-600 text-white'
            )}
            onClick={() => onRecordChange(0)}
          >
            ✗
          </button>
        </>
      ) : (
        <div className="flex items-center">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-l bg-gray-200 hover:bg-gray-300"
            onClick={() => onRecordChange(Math.max(0, value - 1))}
          >
            –
          </button>
          <div className="w-12 h-8 flex items-center justify-center bg-white border-t border-b">
            {value}
          </div>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-r bg-gray-200 hover:bg-gray-300"
            onClick={() => onRecordChange(value + 1)}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}
