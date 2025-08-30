import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { ColumnKey } from '../types';

const REQUIRED: ColumnKey[] = ['year', 'population', 'co2', 'co2_per_capita'];

function formatNumber(v: number | null): string {
  if (v == null) return '';
  return v.toLocaleString();
}

export const CountryCard: React.FC<{ code: string }> = ({ code }) => {
  const { index, year, selectedColumns } = useData();
  const node = index[code];
  if (!node) return null;

  const columns = useMemo(
    () => Array.from(new Set([...REQUIRED, ...selectedColumns])),
    [selectedColumns]
  );

  const shownRow = useMemo(() => {
    return node.data.find((r) => r.year === year);
  }, [node, year]);

  const getValue = (row: any, key: ColumnKey): string => {
    if (!row) return '';
    const v = row[key as keyof typeof row];
    return typeof v === 'number' ? formatNumber(v) : String(v ?? '');
  };

  return (
    <div className="border rounded p-2 mb-2">
      <h3 className="font-bold">{node.name}</h3>
      <table className="text-sm w-full border-collapse">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c} className="border-b p-1 text-left">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {node.data.map((row) => (
            <tr key={row.year} className={row.year === shownRow?.year ? 'bg-yellow-100' : ''}>
              {columns.map((c) => (
                <td key={`${row.year}-${c}`} className="border-b p-1 align-top">
                  {getValue(row, c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
