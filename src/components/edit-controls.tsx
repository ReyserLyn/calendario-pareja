"use client";

interface EditControlsProps {
  onSave: () => void;
  onCancel: () => void;
}

export default function EditControls({ onSave, onCancel }: EditControlsProps) {
  return (
    <div className="fixed bottom-8 right-8 flex gap-4">
      <button
        onClick={onSave}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg"
      >
        Guardar Cambios
      </button>
      <button
        onClick={onCancel}
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg"
      >
        Cancelar
      </button>
    </div>
  );
}
