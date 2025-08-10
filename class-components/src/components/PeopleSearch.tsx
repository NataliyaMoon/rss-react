import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import './PeopleSearch.css';
import ErrorBoundary from './ErrorBoundary';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { toggleSelection, setSearchQuery } from './slices/peopleSlice';
import SelectionBar from './SelectionBar';
import { useGetPeopleQuery } from '../services/swapiApi';
import { swapiApi } from '../services/swapiApi';

function PeopleSearch() {
  const { page: pageParam = '1', detailsId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = Number(pageParam);

  const reduxQuery = useSelector((state: RootState) => state.people.searchQuery);
  const searchParamQuery = searchParams.get('search') || '';
  const [query, setQuery] = useState(searchParamQuery || reduxQuery);

  useEffect(() => {
    if (!searchParamQuery && reduxQuery) {
      setQuery(reduxQuery);
      setSearchParams({ search: reduxQuery });
    }
  }, []);

  const dispatch = useDispatch();
  const selected = useSelector((state: RootState) => state.people.selected);

  const queryString = `search=${encodeURIComponent(query)}&page=${page}`;
  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useGetPeopleQuery(queryString, {
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const people = data?.results || [];
  const count = data?.count || 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    const trimmed = query.trim();
    dispatch(setSearchQuery(trimmed));
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

  const handleSelect = (person: { url: string; name: string; birth_year: string }) => {
    const id = person.url.split('/').filter(Boolean).pop();
    navigate(`/${page}/${id}?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="people-search">
      <section className="search-bar">
        <input
          id="search-input"
          type="text"
          placeholder="Search people..."
          value={query}
          onChange={handleInputChange}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={() => refetch()}>Refresh</button>
        <button
          onClick={() => {
            dispatch(swapiApi.util.invalidateTags(['People']));
            setTimeout(() => {
              refetch();
            }, 0);
          }}
        >
          Clear Cache
        </button>
      </section>
      <section className="results two-columns">
        <ErrorBoundary>
          {isLoading && <p>Loading...</p>}
          {isError && <p className="error">Error: {error && 'status' in error ? error.status : 'Unknown error'}</p>}

          {!isLoading && !isError && (
            <>
              <div className="list-column">
                <table className="results-table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>#</th>
                      <th>Name</th>
                      <th>Birth Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {people.map((person, index) => {
                      const id = person.url.split('/').filter(Boolean).pop() || '';
                      const isActive = id === detailsId;
                      const isChecked = Boolean(selected[person.url]);

                      return (
                        <tr
                          key={person.url}
                          className={isActive ? 'active-row' : ''}
                          onClick={() => handleSelect(person)}
                        >
                          <td onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => dispatch(toggleSelection(person))}
                            />
                          </td>
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
                  <span>Page {page} of {Math.max(1, Math.ceil(count / 10))}</span>
                  <button onClick={handleNext} disabled={page >= Math.ceil(count / 10)}>Next</button>
                </div>
              </div>
            </>
          )}
        </ErrorBoundary>
      </section>
      <SelectionBar />
    </div>
  );
}

export default PeopleSearch;
