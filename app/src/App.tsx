import { useState, useEffect } from 'react';
import useDashboard from './hooks/useDashboard';
import TopBar from './components/TopBar';
import HabitRow from './components/HabitRow';
import HabitModal from './components/HabitModal';
import { createHabit, editHabit, updateRecord, checkRollover, performRollover } from './api';
import { Habit, Record } from './types';

function App() {
  const { data, loading, refresh, optimisticUpdateRecord, setData } = useDashboard();
  const [editMode, setEditMode] = useState(false);
  const [modal, setModal] = useState<{ habit?: Habit } | null>(null);
  const [needsRollover, setNeedsRollover] = useState(false);

  useEffect(() => {
    const checkRolloverStatus = async () => {
      try {
        const rolloverNeeded = await checkRollover();
        setNeedsRollover(rolloverNeeded);
      } catch (error) {
        console.error('Error checking rollover status:', error);
      }
    };

    // Check immediately on mount
    checkRolloverStatus();

    // Set up interval for every 5 minutes (300000ms)
    const interval = setInterval(checkRolloverStatus, 300000);

    return () => clearInterval(interval);
  }, []);

  if (loading || !data) return <p className="p-4">Loading…</p>;

  function getRecordByHabit(habitId: number): Record | undefined {
    if (!data) {return undefined};
    return data.records.find(r => r.habit_id === habitId);
  }

  async function handleRecordChange(record: Record, newValue: number) {
    optimisticUpdateRecord(record.id, newValue);

    if (0) {refresh();}

    setData(await updateRecord(record.id, newValue));
  }

  async function handleCreate(newHabit: Omit<Habit, 'id'>) {
    setData(await createHabit(newHabit));
    setModal(null);
  }

  async function handleEdit(habitId: number, upd: Omit<Habit, 'id'>) {
    setData(await editHabit(habitId, upd));
    setModal(null);
  }

  async function handleRollover() {
    setData(await performRollover());
    setNeedsRollover(false);
  }

  return (
    <div className="max-w-lg mx-auto">
      <TopBar
        onAdd={() => setModal({})}
        editMode={editMode}
        toggleEdit={() => setEditMode(e => !e)}
      />

    {needsRollover && (
        <div className="mt-2 mb-4">
          <button
            onClick={handleRollover}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transition-colors duration-200 flex items-center justify-between text-lg"
          >
            <span>a new age dawns!</span>
            <span>next day ▶</span>
          </button>
        </div>
      )}

      <div className="bg-white shadow-sm divide-y divide-gray-200 mt-2">
        {data.habits.map(habit => (
          <HabitRow
            key={habit.id}
            habit={habit}
            record={getRecordByHabit(habit.id)}
            editMode={editMode}
            onRecordChange={val =>
              handleRecordChange(
                getRecordByHabit(habit.id)!,
                val
              )
            }
            onEditHabit={() => setModal({ habit })}
            onDeleteHabit={() =>
              handleEdit(habit.id, { ...habit, active: false })
            }
          />
        ))}
      </div>

      {modal && (
        <HabitModal
          initial={modal.habit}
          onClose={() => setModal(null)}
          onSave={data =>
            modal.habit
              ? handleEdit(modal.habit.id, data)
              : handleCreate(data)
          }
        />
      )}
    </div>
  );
}
export default App;
