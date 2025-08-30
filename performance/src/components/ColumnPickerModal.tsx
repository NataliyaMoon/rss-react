import React from 'react';
import type { ColumnKey } from '../types';
import { useData } from '../context/DataContext';

const AVAILABLE_COLUMNS: { key: ColumnKey; label: string }[] = [
  { key: 'methane', label: 'Methane' },
  { key: 'oil_co2', label: 'Oil CO₂' },
  { key: 'temperature_change_from_co2', label: 'Temp Change from CO₂' },
  { key: 'coal_co2', label: 'Coal CO₂' },
  { key: 'gas_co2', label: 'Gas CO₂' },
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ColumnPickerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { selectedColumns, setSelectedColumns } = useData();

  if (!isOpen) return null;

  const toggleColumn = (key: ColumnKey) => {
    if (selectedColumns.includes(key)) {
      setSelectedColumns(selectedColumns.filter((c) => c !== key));
    } else {
      setSelectedColumns([...selectedColumns, key]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96">
        <h2 className="text-lg font-semibold mb-4">Выберите дополнительные столбцы</h2>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {AVAILABLE_COLUMNS.map((col) => (
            <label key={col.key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedColumns.includes(col.key)}
                onChange={() => toggleColumn(col.key)}
              />
              <span>{col.label}</span>
            </label>
          ))}
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColumnPickerModal;
