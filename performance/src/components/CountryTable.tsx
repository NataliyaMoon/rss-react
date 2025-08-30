import React, { useMemo, useEffect } from 'react';
import { useData } from '../context/DataContext';

function formatNumber(v: number | null | undefined) {
  if (v == null) return 'N/A';
  return v.toLocaleString();
}

export const CountryTable: React.FC = () => {
  const { index, year, setYear, filteredKeys } = useData();

  const allYears = useMemo(() => {
    const years = new Set<number>();
    for (const key of filteredKeys) {
      const node = index[key];
      if (node) {
        node.data.forEach(r => years.add(r.year));
      }
    }
    return Array.from(years).sort((a, b) => b - a);
  }, [index, filteredKeys]);

  useEffect(() => {
    if (!year && allYears.includes(2023)) {
      setYear(2023);
    } else if (!year && allYears.length > 0) {
      setYear(allYears[0]);
    }
  }, [year, allYears, setYear]);

  return (
    <div className="p-3 overflow-x-auto">
      <table className="border-collapse border w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Country</th>
            <th className="border p-2 text-left">
              Population{' '}
              <select
                value={year ?? ''}
                onChange={e => setYear(Number(e.target.value))}
                className="ml-2 border rounded px-1 py-0.5"
              >
                {allYears.map(y => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </th>
            <th className="border p-2 text-left">CO₂</th>
            <th className="border p-2 text-left">CO₂ per capita</th>
          </tr>
        </thead>
        <tbody>
          {filteredKeys.map(code => {
            const node = index[code];
            if (!node) return null;
            const row = node.data.find(r => r.year === year);

            return (
              <tr key={code}>
                <td className="border p-2">{node.name}</td>
                <td className="border p-2">{formatNumber(row?.population)}</td>
                <td className="border p-2">{formatNumber(row?.co2)}</td>
                <td className="border p-2">{formatNumber(row?.co2_per_capita)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
