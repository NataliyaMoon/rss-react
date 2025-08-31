import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import { useData } from '../context/DataContext';
import { ArrowUp, ArrowDown } from 'lucide-react';
import '../App.css';

function formatNumber(v: number | null | undefined) {
  if (v == null) return 'N/A';
  return v.toLocaleString();
}

const EXTRA_FIELDS = [
  { key: 'methane', label: 'Methane' },
  { key: 'oil_co2', label: 'Oil CO₂' },
  { key: 'temperature_change_from_co2', label: 'Temperature change from CO₂' },
];

export const CountryTable: React.FC = () => {
  const { index, year, setYear, filteredKeys } = useData();
  const [region, setRegion] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<'name' | 'population'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [highlightedYear, setHighlightedYear] = useState<number | null>(null);
  const [extraColumns, setExtraColumns] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

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

  function toggleExtraColumn(key: string) {
    setExtraColumns(prev =>
      prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key]
    );
  }

  return (
    <div className="p-3 overflow-x-auto">
      {showModal && (
        <div
          className="fixed inset-0 z-[9999] bg-black/50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Select additional columns</h2>
            <div className="space-y-3">
              {EXTRA_FIELDS.map((f) => (
                <label key={f.key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={extraColumns.includes(f.key)}
                    onChange={() => toggleExtraColumn(f.key)}
                  />
                  {f.label}
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
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
          onClick={() => setShowModal(true)}
          className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300 text-sm"
        >
          Select columns
        </button>
      </div>
      <table className="border-collapse border w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Country</th>
            <th className="border p-2 text-left">ISO</th>
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
            <th className="border p-2 text-left">CO₂</th>
            <th className="border p-2 text-left">CO₂ per capita</th>
            {extraColumns.map(col => (
              <th key={col} className="border p-2 text-left">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ node, row }) => (
            <tr key={node.iso_code}>
              <td className="border p-2">{node.name}</td>
              <td className="border p-2">{node.iso_code ?? 'N/A'}</td>
              <td
                className={clsx(
                  'border p-2 transition-colors',
                  highlightedYear && 'bg-yellow-100'
                )}
              >
                {formatNumber(row?.population)}
              </td>
              <td
                className={clsx(
                  'border p-2 transition-colors',
                  highlightedYear && 'bg-yellow-100'
                )}
              >
                {formatNumber(row?.co2)}
              </td>
              <td
                className={clsx(
                  'border p-2 transition-colors',
                  highlightedYear && 'bg-yellow-100'
                )}
              >
                {formatNumber(row?.co2_per_capita)}
              </td>
              {extraColumns.map(col => (
                <td
                  key={col}
                  className={clsx(
                    'border p-2 transition-colors',
                    highlightedYear && 'bg-yellow-100'
                  )}
                >
                  {formatNumber((row as any)?.[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
