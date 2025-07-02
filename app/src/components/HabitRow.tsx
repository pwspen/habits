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

  const happy =
    habit.type === 'boolean'
      ? Boolean(value) == isGood
        ? true
        : false
      : isGood
        ? value >= habit.target
          ? true
          : false
        : value <= habit.target
          ? true
          : false

  const shade = 
    happy
    ? 'bg-green-50'
    : 'bg-red-50'
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
            className="text-white bg-blue-600 px-2 text-md rounded"
            onClick={onEditHabit}
          >
            edit
          </button>
          <button
            title="Delete"
            className="text-white bg-blue-600 px-2 text-md rounded"
            onClick={onDeleteHabit}
          >
            delete
          </button>
        </div>
      )}

      {/* MAIN INTERACTION AREA */}
      {habit.type === 'boolean' ? (
        <>
          <button
            className={clsx(
              'w-8 h-8 rounded-full flex items-center justify-center border',

              happy 
                ? value === 1
                  ? 'bg-green-600 text-white'
                  : 'border-red-600 text-red-600'
                : value === 1
                  ? 'bg-red-600 text-white'
                  : 'border-green-600 text-green-600'
            )}
            onClick={() => onRecordChange(1)}
          >
            ✓
          </button>
          <button
            className={clsx(
              'w-8 h-8 rounded-full flex items-center justify-center border ml-2',

              happy 
                ? value === 0
                  ? 'bg-green-600 text-white'
                  : 'border-red-600 text-red-600'
                : value === 0
                  ? 'bg-red-600 text-white'
                  : 'border-green-600 text-green-600'
            )}
            onClick={() => onRecordChange(0)}
          >
            X
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
