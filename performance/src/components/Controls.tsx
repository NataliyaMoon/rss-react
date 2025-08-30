import React, { useCallback } from 'react';
import { useData } from '../context/DataContext';

export const Controls: React.FC<{ onOpenColumns: () => void }> = React.memo(({ onOpenColumns }) => {
  const { years, regions, year, setYear, region, setRegion, search, setSearch, sortKey, sortDir, setSort } = useData();

  const onSortName = useCallback(() => setSort('name', sortKey === 'name' && sortDir === 'asc' ? 'desc' : 'asc'), [setSort, sortKey, sortDir]);
  const onSortPopulation = useCallback(
    () => setSort('population', sortKey === 'population' && sortDir === 'asc' ? 'desc' : 'asc'),
    [setSort, sortKey, sortDir]
  );

  return (
    <div className="flex flex-wrap items-end gap-3 p-3 bg-gray-50 border-b">
      <label className="flex flex-col text-sm">
        Год
        <select
          value={year === 'latest' ? 'latest' : String(year)}
          onChange={(e) => {
            const v = e.target.value;
            setYear(v === 'latest' ? 'latest' : Number(v));
          }}
          className="border p-1 rounded"
        >
          <option value="latest">Последний</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col text-sm">
        Регион
        <select value={region} onChange={(e) => setRegion(e.target.value)} className="border p-1 rounded">
          <option value="all">Все</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col text-sm">
        Поиск страны
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="начните вводить…"
          className="border p-1 rounded min-w-[16rem]"
        />
      </label>

      <div className="flex items-center gap-2 ml-auto">
        <button onClick={onSortName} className="border px-2 py-1 rounded text-sm">
          Сорт: название {sortKey === 'name' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
        </button>
        <button onClick={onSortPopulation} className="border px-2 py-1 rounded text-sm">
          Сорт: население {sortKey === 'population' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
        </button>
        <button onClick={onOpenColumns} className="border px-3 py-1 rounded text-sm bg-white shadow">
          Столбцы…
        </button>
      </div>
    </div>
  );
});
Controls.displayName = 'Controls';