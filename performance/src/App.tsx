import React, { Suspense, useMemo, useState } from 'react';
import { buildCO2Resource } from './data/loadCO2';
import { DataProvider } from './context/DataContext';
import { Spinner } from './components/Spinner';
import { CountryTable } from './components/CountryTable';

const JSON_URL =
  'https://nyc3.digitaloceanspaces.com/owid-public/data/co2/owid-co2-data.json';

const resource = buildCO2Resource(JSON_URL);

const DataRoot: React.FC = () => {
  const index = resource.read();

  useMemo(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      body { background: #f7f7fb; }
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
      th { background: #f9fafb; font-weight: 600; }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <DataProvider index={index}>
      <CountryTable />
    </DataProvider>
  );
};

const App: React.FC = () => {
  return (
    <div>
      <header
        style={{
          padding: 16,
          borderBottom: '1px solid #e5e7eb',
          background: '#fff',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>CO₂ Explorer</h1>
        <p style={{ fontSize: 13, color: '#6b7280' }}>
          List of countries
        </p>
      </header>
      <Suspense fallback={<Spinner />}>
        <DataRoot />
      </Suspense>
    </div>
  );
};

export default App;
