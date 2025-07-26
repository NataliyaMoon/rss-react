import { useEffect, useState } from 'react';
import './PeopleSearch.css';
import ErrorBoundary from './ErrorBoundary';
import CrashComponent from './CrashComponent';
import useLocalStorage from '../hooks/useLocalStorage';

type Person = {
  name: string;
  birth_year: string;
  url: string;
};

function PeopleSearch() {
  const [query, setQuery] = useLocalStorage('peopleSearchQuery', '');
  const [people, setPeople] = useState<Person[]>([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forceError, setForceError] = useState(false);

  useEffect(() => {
    fetchPeople();
  }, [page]);

  const fetchPeople = () => {
    setLoading(true);
    setError('');

    const baseUrl = 'https://swapi.py4e.com/api/people/';
    const url = `${baseUrl}?search=${encodeURIComponent(query.trim())}&page=${page}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }
        return res.json();
      })
      .then((data: { results: Person[]; count: number }) => {
        setPeople(data.results || []);
        setCount(data.count || 0);
        setLoading(false);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Something went wrong.';
        setError(message);
        setLoading(false);
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    const trimmed = query.trim();
    setPage(1);
    setQuery(trimmed);
    setTimeout(fetchPeople, 0);
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    const maxPage = Math.ceil(count / 10);
    if (page < maxPage) {
      setPage((prev) => prev + 1);
    }
  };

  const handleResetError = () => {
    setForceError(false);
  };

  return (
    <div className="people-search">
      <section className="search-bar">
        <input
          type="text"
          placeholder="Search people..."
          value={query}
          onChange={handleInputChange}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={() => setForceError(true)}>Throw Error</button>
      </section>

      <section className="results">
        <ErrorBoundary onReset={handleResetError}>
          {forceError && <CrashComponent />}
          {!forceError && (
            <>
              {loading && <p>Loading...</p>}
              {error && <p className="error">Error: {error}</p>}

              {!loading && !error && (
                <>
                  <table className="results-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Birth Year</th>
                      </tr>
                    </thead>
                    <tbody>
                      {people.map((person, index) => (
                        <tr key={person.url}>
                          <td>{(page - 1) * 10 + index + 1}</td>
                          <td>{person.name}</td>
                          <td>{person.birth_year}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="pagination">
                    <button onClick={handlePrev} disabled={page === 1}>
                      Prev
                    </button>
                    <span>
                      Page {page} of {Math.max(1, Math.ceil(count / 10))}
                    </span>
                    <button
                      onClick={handleNext}
                      disabled={page >= Math.ceil(count / 10)}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </ErrorBoundary>
      </section>
    </div>
  );
}

export default PeopleSearch;
