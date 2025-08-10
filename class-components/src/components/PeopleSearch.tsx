import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import './PeopleSearch.css';
import ErrorBoundary from './ErrorBoundary';
import { useSelector, useDispatch } from 'react-redux';
import { getSearchQuery, getSelectedPeople } from '../store/selectors/peopleSelectors';
import { setSearchQuery } from './slices/peopleSlice';
import SelectionBar from './SelectionBar';
import { useGetPeopleQuery, swapiApi } from '../services/swapiApi';
import PersonRow from './PersonRow';

function PeopleSearch() {
  const { page: pageParam = '1', detailsId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = Number(pageParam);

  const reduxQuery = useSelector(getSearchQuery);
  const selected = useSelector(getSelectedPeople);
  const dispatch = useDispatch();

  const searchParamQuery = searchParams.get('search') || '';
  const [query, setQuery] = useState(
    searchParamQuery || localStorage.getItem('lastSearch') || reduxQuery || ''
  );

  useEffect(() => {
    if (!searchParamQuery && query) {
      setSearchParams({ search: query });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('lastSearch', query);
  }, [query]);

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
    refetchOnFocus: true
  });

  const people = data?.results || [];
  const count = data?.count || 0;
  const maxPage = Math.max(1, Math.ceil(count / 10));

  const handleSearch = () => {
    const trimmed = query.trim();
    dispatch(setSearchQuery(trimmed));
    localStorage.setItem('lastSearch', trimmed);
    setSearchParams({ search: trimmed });
    navigate(`/1${detailsId ? `/${detailsId}` : ''}?search=${encodeURIComponent(trimmed)}`);
  };

  const handlePrev = () => {
    if (page > 1) {
      navigate(`/${page - 1}${detailsId ? `/${detailsId}` : ''}?search=${encodeURIComponent(query)}`);
    }
  };

  const handleNext = () => {
    if (page < maxPage) {
      navigate(`/${page + 1}${detailsId ? `/${detailsId}` : ''}?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="people-search">
      <section className="search-bar">
        <input
          id="search-input"
          type="text"
          placeholder="Search people..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={() => refetch()}>Refresh</button>
        <button
          onClick={() => {
            dispatch(swapiApi.util.invalidateTags(['People']));
            setTimeout(refetch, 0);
          }}
        >
          Clear cache
        </button>
      </section>

      <section className="results two-columns">
        <ErrorBoundary>
          {isLoading && <p>Loading...</p>}
          {isError && (
            <p className="error">
              Error: {error && 'status' in error ? error.status : 'Unknown error'}
            </p>
          )}

          {!isLoading && !isError && (
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
                  {people.map((person, index) => (
                    <PersonRow
                      key={person.url}
                      person={person}
                      index={index}
                      page={page}
                      query={query}
                    />
                  ))}
                </tbody>
              </table>

              <div className="pagination">
                <button onClick={handlePrev} disabled={page === 1}>Prev</button>
                <span>Page {page} of {maxPage}</span>
                <button onClick={handleNext} disabled={page >= maxPage}>Next</button>
              </div>
            </div>
          )}
        </ErrorBoundary>
      </section>

      <SelectionBar />
    </div>
  );
}

export default PeopleSearch;
