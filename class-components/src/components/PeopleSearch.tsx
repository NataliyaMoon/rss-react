import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import './PeopleSearch.css';
import ErrorBoundary from './ErrorBoundary';
import useLocalStorage from '../hooks/useLocalStorage';

type Person = {
  name: string;
  birth_year: string;
  url: string;
  gender: string;
  height: string;
  mass: string;
  eye_color: string;
};

function PeopleSearch() {
  const { page: pageParam = '1', detailsId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = Number(pageParam);

  const [storedQuery, setStoredQuery] = useLocalStorage('peopleSearchQuery', '');
  const searchParamQuery = searchParams.get('search') || '';
  const [query, setQuery] = useState(searchParamQuery || storedQuery);

  const [people, setPeople] = useState<Person[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const baseUrl = 'https://swapi.py4e.com/api/people/';
        const url = `${baseUrl}?search=${encodeURIComponent(query)}&page=${page}`;
        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        setPeople(data.results || []);
        setCount(data.count || 0);
      } catch (err: unknown) {
        if (!(err instanceof DOMException)) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          setError(message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [page, query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    const trimmed = query.trim();
    setStoredQuery(trimmed);
    setSearchParams({ search: trimmed });
    navigate(`/1${detailsId ? `/${detailsId}` : ''}`);
  };

  const handlePrev = () => {
    if (page > 1) {
      navigate(`/${page - 1}${detailsId ? `/${detailsId}` : ''}?search=${encodeURIComponent(query)}`);
    }
  };

  const handleNext = () => {
    const maxPage = Math.ceil(count / 10);
    if (page < maxPage) {
      navigate(`/${page + 1}${detailsId ? `/${detailsId}` : ''}?search=${encodeURIComponent(query)}`);
    }
  };

  const handleSelect = (person: Person) => {
    const id = person.url.split('/').filter(Boolean).pop();
    navigate(`/${page}/${id}?search=${encodeURIComponent(query)}`);
  };

  const selectedPerson = people.find((p) => {
    const id = p.url.split('/').filter(Boolean).pop();
    return id === detailsId;
  });

  return (
    <div className="people-search">
      <section className="search-bar">
        <input
          id='search-input'
          type="text"
          placeholder="Search people..."
          value={query}
          onChange={handleInputChange}
        />
        <button onClick={handleSearch}>Search</button>
      </section>

      <section className="results two-columns">
        <ErrorBoundary>
          {loading && <p>Loading...</p>}
          {error && <p className="error">Error: {error}</p>}

          {!loading && !error && (
            <>
              <div className="list-column">
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Birth Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {people.map((person, index) => {
                      const id = person.url.split('/').filter(Boolean).pop();
                      const isActive = id === detailsId;
                      return (
                        <tr
                          key={person.url}
                          className={isActive ? 'active-row' : ''}
                          onClick={() => handleSelect(person)}
                        >
                          <td>{(page - 1) * 10 + index + 1}</td>
                          <td>{person.name}</td>
                          <td>{person.birth_year}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="pagination">
                  <button onClick={handlePrev} disabled={page === 1}>Prev</button>
                  <span>Page {page} of {Math.ceil(count / 10)}</span>
                  <button onClick={handleNext} disabled={page >= Math.ceil(count / 10)}>Next</button>
                </div>
              </div>
            </>
          )}
        </ErrorBoundary>
      </section>
    </div>
  );
}

export default PeopleSearch;
