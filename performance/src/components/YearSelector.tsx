import React from 'react';
import { useData } from '../context/DataContext';

export const YearSelector: React.FC = () => {
  const { years, year, setYear } = useData();

  return (
    <div className="p-3">
      <label className="mr-2 font-medium">Год:</label>
      <select
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
        className="border rounded p-1"
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
};
