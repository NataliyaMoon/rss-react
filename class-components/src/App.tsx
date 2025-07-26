import { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
} from 'react-router-dom';
import PeopleSearch from './components/PeopleSearch';
import PersonDetailsWrapper from './components/PersonDetailsWrapper';
import AboutUs from './components/AboutUs'; // ✅ добавлено
import './App.css';

function AppContent() {
  const [visible, setVisible] = useState<boolean>(true);
  const toggle = (): void => setVisible((prev: boolean): boolean => !prev);

  return (
    <main className="main">
      <header className="header">
        <h1>React app</h1>
        <button onClick={toggle}>{visible ? 'Hide' : 'Show'}</button>
      </header>
      <section className="app-body">
        {visible && (
          <>
            <PeopleSearch />
            <Outlet />
          </>
        )}
      </section>
    </main>
  );
}

function PageWrapper() {
  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppContent />}>
          <Route path=":page" element={<PageWrapper />}>
            <Route path=":detailsId" element={<PersonDetailsWrapper />} />
          </Route>
        </Route>
        <Route path="/about" element={<AboutUs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
