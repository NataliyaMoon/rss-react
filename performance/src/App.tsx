import React, { Suspense } from 'react';
import { buildCO2Resource } from './data/loadCO2';
import { DataProvider } from './context/DataContext';
import { Spinner } from './components/Spinner';
import { CountryTable } from './components/CountryTable';
import './App.css';

const JSON_URL =
  'https://nyc3.digitaloceanspaces.com/owid-public/data/co2/owid-co2-data.json';

const resource = buildCO2Resource(JSON_URL);

const DataRoot: React.FC = () => {
  const index = resource.read();

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
        <p style={{ fontSize: 13, color: '#6b7280' }}>List of countries</p>
      </header>
      <Suspense fallback={<Spinner />}>
        <DataRoot />
      </Suspense>
    </div>
  );
};

export default App;
