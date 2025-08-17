'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import { setSearchQuery } from './slices/peopleSlice';
import { useGetPeopleQuery, swapiApi } from '../src/services/swapiApi';

import SelectionBar from './SelectionBar';
import PersonRow from './PersonRow';
import PersonDetails from './PersonDetails';
import ErrorBoundary from './ErrorBoundary';

import './PeopleSearch.css';

type Messages = {
  searchPlaceholder: string;
  searchButton: string;
  refreshButton: string;
  clearCacheButton: string;
};

type PeopleSearchProps = {
  messages: Messages;
};

export default function PeopleSearch({ messages }: PeopleSearchProps) {
  const searchParams = useSearchParams();
  const reduxQuery = useSelector((state: any) => state.people?.searchQuery ?? '');
  const dispatch = useDispatch();

  const searchParamQuery = searchParams.get('search') || '';
  const [query, setQuery] = useState<string>(
    searchParamQuery ||
      (typeof window !== 'undefined' ? localStorage.getItem('lastSearch') || '' : '') ||
      reduxQuery ||
      ''
  );

  const [page, setPage] = useState<number>(Number(searchParams.get('page') || '1'));
  const [selectedPersonUrl, setSelectedPersonUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastSearch', query);
    }
  }, [query]);

  const queryString = `search=${encodeURIComponent(query)}&page=${page}`;
  const { data, isLoading, isError, error, refetch } = useGetPeopleQuery(queryString, {
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const people = data?.results || [];
  const count = data?.count || 0;
  const maxPage = Math.max(1, Math.ceil(count / 10));

  const handleSearch = () => {
    const trimmed = query.trim();
    dispatch(setSearchQuery(trimmed));
    setPage(1);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastSearch', trimmed);
    }
  };

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < maxPage) setPage((prev) => prev + 1);
  };

  const handleSelectPerson = (url: string) => {
    setSelectedPersonUrl(url);
  };

  return (
    <div className="people-search two-columns">
      <div className="list-column">
        <section className="search-bar">
          <input
            id="search-input"
            type="text"
            placeholder={messages.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={handleSearch}>{messages.searchButton}</button>
          <button onClick={() => refetch()}>{messages.refreshButton}</button>
          <button
            onClick={() => {
              (dispatch as any)(swapiApi.util.invalidateTags(['People']));
              setTimeout(refetch, 0);
            }}
          >
            {messages.clearCacheButton}
          </button>
        </section>

        <section className="results">
          <ErrorBoundary>
            {isLoading && <p>Loading...</p>}
            {isError && (
              <p className="error">
                Error: {error && 'status' in error ? (error as any).status : 'Unknown error'}
              </p>
            )}

            {!isLoading && !isError && (
              <>
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
                    {people.map((person: any, index: number) => (
                      <PersonRow
                        key={person.url}
                        person={person}
                        index={index}
                        page={page}
                        query={query}
                        onSelect={handleSelectPerson}
                        selectedPersonUrl={selectedPersonUrl}
                      />
                    ))}
                  </tbody>
                </table>

                <div className="pagination">
                  <button onClick={handlePrev} disabled={page === 1}>
                    &lt;
                  </button>
                  <span>
                    Page {page} of {maxPage}
                  </span>
                  <button onClick={handleNext} disabled={page >= maxPage}>
                    &gt;
                  </button>
                </div>
              </>
            )}
          </ErrorBoundary>
        </section>

        <SelectionBar />
      </div>

      <div className="detail-column">
        {selectedPersonUrl && <PersonDetails url={selectedPersonUrl} />}
      </div>
    </div>
  );
}
