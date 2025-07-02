import clsx from 'clsx';

interface Props {
  onAdd: () => void;
  editMode: boolean;
  toggleEdit: () => void;
}

export default function TopBar({ onAdd, editMode, toggleEdit }: Props) {
  return (
    <header className="flex justify-between items-center px-4 py-2 bg-white shadow-sm sticky top-0">
      <h1 className="text-lg font-semibold">habits</h1>
      <div className="space-x-2">
        <button
          onClick={onAdd}
          className="px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
        >
          add
        </button>
        <button
          onClick={toggleEdit}
          className={clsx(
            'px-3 py-1 rounded text-sm border',
            editMode
              ? 'bg-gray-200 border-gray-400'
              : 'bg-white border-gray-300 hover:bg-gray-100'
          )}
        >
          {editMode ? 'done' : 'edit'}
        </button>
      </div>
    </header>
  );
}
