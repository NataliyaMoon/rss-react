import { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useNavigate,
} from 'react-router-dom';

import { ThemeProvider, useTheme } from '../src/components/ThemeContext';

import PeopleSearch from './components/PeopleSearch';
import PersonDetailsWrapper from './components/PersonDetailsWrapper';
import AboutUs from './components/AboutUs';
import './App.css';

function AppContent() {
  const [visible, setVisible] = useState<boolean>(true);
  const toggle = (): void => setVisible((prev) => !prev);
  const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme();

  return (
    <main className={`main ${theme}`}>
      <header className="header">
        <h1>React app</h1>
        <button onClick={toggle}>{visible ? 'Hide' : 'Show'}</button>
        <button onClick={() => navigate('/about')}>About us</button>
        <button onClick={toggleTheme}>Toggle theme ({theme})</button>
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
    <ThemeProvider>
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
    </ThemeProvider>
  );
}

export default App;
