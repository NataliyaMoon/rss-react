import React, { useMemo } from 'react';
import type { ColumnKey, YearRecord } from '../types';
import { useData } from '../context/DataContext';

const REQUIRED: ColumnKey[] = ['year', 'population', 'co2', 'co2_per_capita'];

function getValue(row: YearRecord, key: ColumnKey): string | number {
  if (key === 'year') return row.year;
  const v = row[key];
  return v == null ? 'N/A' : (typeof v === 'number' ? Number.isFinite(v) ? v : 'N/A' : (v as string));
}

export const CountryCard: React.FC<{ countryKey: string }> = React.memo(({ countryKey }) => {
  const { index, year, selectedColumns } = useData();
  const node = index[countryKey];


  const latest = node.data[node.data.length - 1];
  const shownRow = useMemo(() => {
    if (year === 'latest') return latest;
    return node.data.find((r) => r.year === year) ?? latest;
  }, [node.data, latest, year]);


  const columns = useMemo(() => [...REQUIRED, ...selectedColumns], [selectedColumns]);

  return (
    <div className="border rounded-2xl p-3 shadow-sm bg-white country-card">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
        <div>
          <h4 className="text-base font-semibold">{node.name}</h4>
          <div className="text-xs text-gray-600">{node.iso_code ?? '—'}{node.region ? ` • ${node.region}` : ''}</div>
        </div>
        <div className="text-xs text-gray-600">Показан год: <span className="year-badge">{shownRow.year}</span></div>
      </div>

      <div className="overflow-auto">
        <table className="min-w-[560px] w-full text-sm border-collapse">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c} className="border-b text-left p-1 font-medium sticky top-0 bg-white">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {node.data.map((row) => (
              <tr key={row.year} className={row.year === shownRow.year ? 'highlight' : ''}>
                {columns.map((c) => (
                  <td key={c} className="border-b p-1 align-top">{getValue(row, c)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
CountryCard.displayName = 'CountryCard';