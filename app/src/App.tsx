import { useState } from 'react';
import useDashboard from './hooks/useDashboard';
import TopBar from './components/TopBar';
import HabitRow from './components/HabitRow';
import HabitModal from './components/HabitModal';
import { createHabit, editHabit, updateRecord } from './api';
import { Habit, Record } from './types';

function App() {
  const { data, loading, refresh, optimisticUpdateRecord } = useDashboard();
  const [editMode, setEditMode] = useState(false);
  const [modal, setModal] = useState<{ habit?: Habit } | null>(null);

  if (loading || !data) return <p className="p-4">Loading…</p>;

  function getRecordByHabit(habitId: number): Record | undefined {
    return data.records.find(r => r.habit_id === habitId);
  }

  async function handleRecordChange(record: Record, newValue: number) {
    optimisticUpdateRecord(record.id, newValue);
    const updated = await updateRecord(record.id, newValue);
    refresh(); // ensures reconciliation
  }

  async function handleCreate(newHabit: Omit<Habit, 'id'>) {
    await createHabit(newHabit);
    setModal(null);
    refresh();
  }

  async function handleEdit(habitId: number, upd: Omit<Habit, 'id'>) {
    await editHabit(habitId, upd);
    setModal(null);
    refresh();
  }

  return (
    <div className="max-w-lg mx-auto">
      <TopBar
        onAdd={() => setModal({})}
        editMode={editMode}
        toggleEdit={() => setEditMode(e => !e)}
      />

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
