import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import type { CO2Index, ColumnKey, SortDir, SortKey } from '../types';

export type DataContextValue = {
  index: CO2Index;
  year: number | 'latest';
  setYear: (y: number | 'latest') => void;
  region: string | 'all';
  setRegion: (r: string | 'all') => void;
  search: string;
  setSearch: (q: string) => void;
  sortKey: SortKey;
  sortDir: SortDir;
  setSort: (key: SortKey, dir: SortDir) => void;
  selectedColumns: ColumnKey[];
  setSelectedColumns: (cols: ColumnKey[]) => void;
  regions: string[];
  years: number[];
  filteredKeys: string[];
};

const DataContext = createContext<DataContextValue | null>(null);

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within <DataProvider>');
  return ctx;
}

function computeRegions(index: CO2Index): string[] {
  const set = new Set<string>();
  Object.values(index).forEach((c) => c.region && set.add(c.region));
  return Array.from(set).sort();
}

function computeYears(index: CO2Index): number[] {
  const set = new Set<number>();
  Object.values(index).forEach((c) => c.data.forEach((d) => set.add(d.year)));
  return Array.from(set).sort((a, b) => a - b);
}

export const DataProvider: React.FC<{ index: CO2Index; children: React.ReactNode }> = ({ index, children }) => {
  const [year, setYear] = useState<number | 'latest'>('latest');
  const [region, setRegion] = useState<string | 'all'>('all');
  const [search, setSearch] = useState<string>('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [selectedColumns, setSelectedColumns] = useState<ColumnKey[]>([]);

  const regions = useMemo(() => computeRegions(index), [index]);
  const years = useMemo(() => computeYears(index), [index]);

  const setSort = useCallback((key: SortKey, dir: SortDir) => {
    setSortKey(key);
    setSortDir(dir);
  }, []);

  const filteredKeys = useMemo(() => {
    const byRegion = region === 'all'
      ? Object.keys(index)
      : Object.keys(index).filter((k) => index[k].region === region);

    const bySearch = search.trim()
      ? byRegion.filter((k) => index[k].name.toLowerCase().includes(search.trim().toLowerCase()))
      : byRegion;

    const withYearValue = (k: string): number | null => {
      const series = index[k].data;
      if (series.length === 0) return null;
      if (year === 'latest') return series[series.length - 1].population ?? null;
      const rec = series.find((r) => r.year === year);
      return rec?.population ?? null;
    };

    const sorted = [...bySearch].sort((a, b) => {
      if (sortKey === 'name') {
        const cmp = index[a].name.localeCompare(index[b].name);
        return sortDir === 'asc' ? cmp : -cmp;
      }
      const av = withYearValue(a);
      const bv = withYearValue(b);
      const cmp = (av ?? -Infinity) - (bv ?? -Infinity);
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return sorted;
  }, [index, region, search, sortKey, sortDir, year]);

  const value: DataContextValue = {
    index,
    year,
    setYear,
    region,
    setRegion,
    search,
    setSearch,
    sortKey,
    sortDir,
    setSort,
    selectedColumns,
    setSelectedColumns,
    regions,
    years,
    filteredKeys,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
