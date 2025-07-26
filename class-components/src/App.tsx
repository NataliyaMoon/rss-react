import { useState } from 'react';
import PeopleSearch from './components/PeopleSearch';
import './App.css';

function App() {
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

export default App;

