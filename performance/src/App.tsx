import React, { Suspense, useMemo, useState } from 'react';
import { buildCO2Resource } from './data/loadCO2';
import { DataProvider } from './context/DataContext';
import { Spinner } from './components/Spinner';
import { Controls } from './components/Controls';
import ColumnPickerModal from './components/ColumnPickerModal';
import { CountryList } from './components/CountryList';

const JSON_URL = 'https://nyc3.digitaloceanspaces.com/owid-public/data/co2/owid-co2-data.json';

const resource = buildCO2Resource(JSON_URL);

const DataRoot: React.FC = () => {
  const index = resource.read();

  const [modalOpen, setModalOpen] = useState(false);
  const open = () => setModalOpen(true);
  const close = () => setModalOpen(false);

  useMemo(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .highlight { background: rgba(255, 240, 0, 0.12); animation: flash 0.8s ease-out; }
      @keyframes flash { from { background: rgba(255, 240, 0, 0.8); } to { background: rgba(255, 240, 0, 0.12); } }
      .year-badge { padding: 2px 6px; border-radius: 999px; border: 1px solid #ddd; }
      body { background: #f7f7fb; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <DataProvider index={index}>
      <Controls onOpenColumns={open} />
      <CountryList />
      <ColumnPickerModal isOpen={modalOpen} onClose={close} />
    </DataProvider>
  );
};

const App: React.FC = () => {
  return (
    <div>
      <header className="p-4 border-b bg-white sticky top-0 z-10">
        <h1 className="text-xl font-bold">CO₂ Explorer</h1>
        <p className="text-sm text-gray-600">По странам: фильтр по региону и поиск</p>
      </header>
      <Suspense fallback={<Spinner />}>
        <DataRoot />
      </Suspense>
    </div>
  );
};

export default App;
