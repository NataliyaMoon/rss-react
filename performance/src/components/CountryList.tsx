import React from 'react';
import { useData } from '../context/DataContext';
import { CountryCard } from './CountryCard';

export const CountryList: React.FC = React.memo(() => {
  const { filteredKeys } = useData();
  return (
    <div className="grid gap-3 p-3">
      {filteredKeys.map((k) => (
        <CountryCard key={k} countryKey={k} />
      ))}
    </div>
  );
});
CountryList.displayName = 'CountryList';