'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import { setSearchQuery } from './slices/peopleSlice';
import { useGetPeopleQuery, swapiApi } from '../src/services/swapiApi';

import SelectionBar from './SelectionBar';
import PersonRow from './PersonRow';
import ErrorBoundary from './ErrorBoundary';

import './PeopleSearch.css';

export default function PeopleSearch() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const locale = (params?.locale as string) || '';
  const page = Number(params?.page ?? '1');

  const detailsId = params?.detailsId as string | undefined;

  const reduxQuery = useSelector((state: any) => state.people?.searchQuery ?? '');
  const dispatch = useDispatch();

  const searchParamQuery = searchParams.get('search') || '';
  const [query, setQuery] = useState<string>(
    searchParamQuery ||
    (typeof window !== 'undefined' ? localStorage.getItem('lastSearch') || '' : '') ||
    reduxQuery ||
    ''
  );

  useEffect(() => {
    if (!searchParamQuery && query) {
      router.replace(`?search=${encodeURIComponent(query)}`);
    }
  }, []);

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
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastSearch', trimmed);
    }
    const url = `/${locale}/people/1${detailsId ? `/${detailsId}` : ''}?search=${encodeURIComponent(trimmed)}`;
    router.push(url);
  };

  const handlePrev = () => {
    if (page > 1) {
      const url = `/${locale}/people/${page - 1}${detailsId ? `/${detailsId}` : ''}?search=${encodeURIComponent(query)}`;
      router.push(url);
    }
  };

  const handleNext = () => {
    if (page < maxPage) {
      const url = `/${locale}/people/${page + 1}${detailsId ? `/${detailsId}` : ''}?search=${encodeURIComponent(query)}`;
      router.push(url);
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
            (dispatch as any)(swapiApi.util.invalidateTags(['People']));
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
              Error: {error && 'status' in error ? (error as any).status : 'Unknown error'}
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
                  {people.map((person: any, index: number) => (
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
                <button onClick={handlePrev} disabled={page === 1}>
                  Prev
                </button>
                <span>
                  Page {page} of {maxPage}
                </span>
                <button onClick={handleNext} disabled={page >= maxPage}>
                  Next
                </button>
              </div>
            </div>
          )}
        </ErrorBoundary>
      </section>

      <SelectionBar />
    </div>
  );
}
