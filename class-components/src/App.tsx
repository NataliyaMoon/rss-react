import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PeopleSearch from './components/PeopleSearch';
import './App.css';

function AppContent() {
  const [visible, setVisible] = useState(true);
  const toggle = () => setVisible((prev) => !prev);

  return (
    <main className="main">
      <header className="header">
        <h1>Class-components</h1>
        <button onClick={toggle}>
          {visible ? 'Hide' : 'Show'}
        </button>
      </header>
      {visible && <PeopleSearch />}
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/:page" element={<AppContent />} />
        <Route path="/:page/:detailsId" element={<AppContent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
