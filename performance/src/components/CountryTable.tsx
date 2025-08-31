import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import { useData } from '../context/DataContext';
import { ArrowUp, ArrowDown } from 'lucide-react';

function formatNumber(v: number | null | undefined) {
  if (v == null) return 'N/A';
  return v.toLocaleString();
}

export const CountryTable: React.FC = () => {
  const { index, year, setYear, filteredKeys } = useData();
  const [region, setRegion] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<'name' | 'population'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [highlightedYear, setHighlightedYear] = useState<number | null>(null);

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'population',
    'co2',
    'co2_per_capita',
  ]);

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

  const regions = useMemo(() => {
    const set = new Set<string>();
    for (const key of filteredKeys) {
      const node = index[key];
      if (node?.region) set.add(node.region);
    }
    return Array.from(set).sort();
  }, [index, filteredKeys]);

  const rows = useMemo(() => {
    let items = filteredKeys
      .map(code => index[code])
      .filter(Boolean);

    if (region !== 'all') {
      items = items.filter(n => n?.region === region);
    }

    if (search.trim()) {
      const s = search.toLowerCase();
      items = items.filter(n => n?.name.toLowerCase().includes(s));
    }

    const withRow = items.map(n => ({
      node: n!,
      row: n!.data.find(r => r.year === year),
    }));

    if (sortKey === 'name') {
      withRow.sort((a, b) =>
        sortOrder === 'asc'
          ? a.node.name.localeCompare(b.node.name)
          : b.node.name.localeCompare(a.node.name)
      );
    } else {
      withRow.sort((a, b) => {
        const av = a.row?.population ?? 0;
        const bv = b.row?.population ?? 0;
        return sortOrder === 'asc' ? av - bv : bv - av;
      });
    }

    return withRow;
  }, [index, filteredKeys, region, search, sortKey, sortOrder, year]);

  function handleYearChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newYear = Number(e.target.value);
    setYear(newYear);
    setHighlightedYear(newYear);
    setTimeout(() => setHighlightedYear(null), 800);
  }

  function toggleSortOrder() {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  }

  function toggleColumn(col: string) {
    setSelectedColumns(prev =>
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    );
  }

  return (
    <div className="p-3 overflow-x-auto">
      <div className="flex flex-wrap gap-3 mb-3 items-center">
        <input
          type="text"
          placeholder="Search country..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        />
        <select
          value={region}
          onChange={e => setRegion(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="all">All regions</option>
          {regions.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <select
            value={sortKey}
            onChange={e => setSortKey(e.target.value as 'name' | 'population')}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="name">Sort by name</option>
            <option value="population">Sort by population</option>
          </select>
          <button
            onClick={toggleSortOrder}
            className="p-1 border rounded hover:bg-gray-100"
          >
            {sortOrder === 'asc' ? (
              <ArrowUp size={16} />
            ) : (
              <ArrowDown size={16} />
            )}
          </button>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="border px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm"
        >
          Columns
        </button>
      </div>

      <table className="border-collapse border w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Country</th>
            <th className="border p-2 text-left">ISO</th>
            {selectedColumns.includes('population') && (
              <th className="border p-2 text-left">
                Population{' '}
                <select
                  value={year}
                  onChange={handleYearChange}
                  className="border rounded px-1 py-0.5 ml-2"
                >
                  {allYears.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </th>
            )}
            {selectedColumns.includes('co2') && (
              <th className="border p-2 text-left">CO₂</th>
            )}
            {selectedColumns.includes('co2_per_capita') && (
              <th className="border p-2 text-left">CO₂ per capita</th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ node, row }) => (
            <tr key={node.iso_code}>
              <td className="border p-2">{node.name}</td>
              <td className="border p-2">{node.iso_code || 'N/A'}</td>
              {selectedColumns.includes('population') && (
                <td
                  className={clsx(
                    'border p-2 transition-colors',
                    highlightedYear && 'bg-yellow-100'
                  )}
                >
                  {formatNumber(row?.population)}
                </td>
              )}
              {selectedColumns.includes('co2') && (
                <td
                  className={clsx(
                    'border p-2 transition-colors',
                    highlightedYear && 'bg-yellow-100'
                  )}
                >
                  {formatNumber(row?.co2)}
                </td>
              )}
              {selectedColumns.includes('co2_per_capita') && (
                <td
                  className={clsx(
                    'border p-2 transition-colors',
                    highlightedYear && 'bg-yellow-100'
                  )}
                >
                  {formatNumber(row?.co2_per_capita)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-lg p-5 shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-3">Select columns</h2>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedColumns.includes('population')}
                  onChange={() => toggleColumn('population')}
                />
                Population
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedColumns.includes('co2')}
                  onChange={() => toggleColumn('co2')}
                />
                CO₂
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedColumns.includes('co2_per_capita')}
                  onChange={() => toggleColumn('co2_per_capita')}
                />
                CO₂ per capita
              </label>
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
