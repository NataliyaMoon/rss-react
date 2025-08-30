import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import type { CO2Index, SortKey, SortDir, ColumnKey } from '../types';

type ContextShape = {
  index: CO2Index;
  years: number[];
  regions: string[];
  year: number;
  setYear: (y: number) => void;
  region: string;
  setRegion: (r: string) => void;
  search: string;
  setSearch: (s: string) => void;
  sortKey: SortKey;
  sortDir: SortDir;
  setSort: (k: SortKey, d: SortDir) => void;
  selectedColumns: ColumnKey[];
  setSelectedColumns: (cols: ColumnKey[]) => void;
  filteredKeys: string[];
  selectedCountry: string | null;
  setSelectedCountry: (k: string | null) => void;
};

const DataContext = createContext<ContextShape | undefined>(undefined);

function last<T>(arr: readonly T[]): T | undefined {
  return arr && arr.length ? arr[arr.length - 1] : undefined;
}

export const DataProvider: React.FC<{ index: CO2Index; children: React.ReactNode }> = ({ index, children }) => {
  const years = useMemo(() => {
    const s = new Set<number>();
    Object.values(index).forEach((node) => {
      node.data.forEach((r) => {
        if (typeof r.year === 'number') s.add(r.year);
      });
    });
    return Array.from(s).sort((a, b) => a - b);
  }, [index]);

  const latestYear = years.length ? years[years.length - 1] : new Date().getFullYear();

  const [year, setYear] = useState<number>(latestYear);
  useEffect(() => {
    setYear(latestYear);
  }, [latestYear]);

  const [region, setRegion] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [selectedColumnsState, setSelectedColumnsState] = useState<ColumnKey[]>(['co2', 'population']);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const setSelectedColumns = useCallback((cols: ColumnKey[]) => {
    setSelectedColumnsState(Array.from(new Set(cols)));
  }, []);

  const regions = useMemo(() => {
    const s = new Set<string>();
    Object.values(index).forEach((node) => {
      const isCountry = !!node.iso_code && node.iso_code.length === 3;
      if (isCountry && node.region) s.add(node.region);
    });
    return ['all', ...Array.from(s).sort()];
  }, [index]);

  const getNumberForYear = useCallback((nodeKey: string, field: 'population'): number | null => {
    const node = index[nodeKey];
    const series = node.data;
    if (!series || series.length === 0) return null;
    const rec = series.find((x) => x.year === year) ?? last(series);
    const v = rec ? (rec as any)[field] : undefined;
    return typeof v === 'number' && Number.isFinite(v) ? v : null;
  }, [index, year]);

  const filteredKeys = useMemo(() => {
    let keys = Object.keys(index).filter((k) => {
      const node = index[k];
      const isCountry = !!node.iso_code && node.iso_code.length === 3;
      if (!isCountry) return false;
      if (region !== 'all' && node.region !== region) return false;
      if (search && !node.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });

    keys.sort((a, b) => {
      if (sortKey === 'name') {
        const na = index[a].name;
        const nb = index[b].name;
        return sortDir === 'asc' ? na.localeCompare(nb) : nb.localeCompare(na);
      }
      const va = getNumberForYear(a, 'population');
      const vb = getNumberForYear(b, 'population');
      const na = va ?? -Infinity;
      const nb = vb ?? -Infinity;
      return sortDir === 'asc' ? na - nb : nb - na;
    });

    return keys;
  }, [index, region, search, sortKey, sortDir, getNumberForYear]);

  useEffect(() => {
    if (!selectedCountry && filteredKeys.length) {
      setSelectedCountry(filteredKeys[0]);
    } else if (selectedCountry && !filteredKeys.includes(selectedCountry)) {
      setSelectedCountry(filteredKeys.length ? filteredKeys[0] : null);
    }
  }, [filteredKeys, selectedCountry]);

  const setSort = useCallback((k: SortKey, d: SortDir) => {
    setSortKey(k);
    setSortDir(d);
  }, []);

  const value: ContextShape = {
    index,
    years,
    regions,
    year,
    setYear,
    region,
    setRegion,
    search,
    setSearch,
    sortKey,
    sortDir,
    setSort,
    selectedColumns: selectedColumnsState,
    setSelectedColumns,
    filteredKeys,
    selectedCountry,
    setSelectedCountry,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};
