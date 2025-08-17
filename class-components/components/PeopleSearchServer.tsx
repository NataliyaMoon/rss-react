'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery } from './slices/peopleSlice';
import SelectionBar from './SelectionBar';
import PersonRow from './PersonRow';
import PersonDetails from './PersonDetails';
import ErrorBoundary from './ErrorBoundary';
import type { RootState } from 'store';

import './PeopleSearch.css';

export type Messages = {
  searchPlaceholder: string;
  searchButton: string;
  refreshButton: string;
  clearCacheButton: string;
};

export type Person = {
  name: string;
  birth_year: string;
  gender: string;
};

export type PeopleSearchProps = {
  messages: Messages;
  serverPeople: Person[];
};

export default function PeopleSearchServer({ messages, serverPeople }: PeopleSearchProps) {
  const reduxQuery = useSelector((state: RootState) => state.people?.searchQuery ?? '');
  const dispatch = useDispatch();

  const [query, setQuery] = useState<string>(reduxQuery || '');
  const [page, setPage] = useState<number>(1);
  const [selectedPersonName, setSelectedPersonName] = useState<string | null>(null);

  const filteredPeople = serverPeople.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const count = filteredPeople.length;
  const maxPage = Math.max(1, Math.ceil(count / 10));
  const start = (page - 1) * 10;
  const peoplePage = filteredPeople.slice(start, start + 10);

  const handleSearch = () => {
    const trimmed = query.trim();
    dispatch(setSearchQuery(trimmed));
    setPage(1);
  };

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < maxPage) setPage((prev) => prev + 1);
  };

  const handleSelectPerson = (name: string) => {
    setSelectedPersonName(name);
  };

  const handleCloseDetails = () => {
    setSelectedPersonName(null);
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
          <button onClick={() => setPage(1)}>{messages.refreshButton}</button>
          <button
            onClick={() => {
              dispatch(setSearchQuery(''));
              setQuery('');
              setPage(1);
            }}
          >
            {messages.clearCacheButton}
          </button>
        </section>

        <section className="results">
          <ErrorBoundary>
            {peoplePage.length === 0 ? (
              <p>No results</p>
            ) : (
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
                    {peoplePage.map((person, index) => (
                      <PersonRow
                        key={person.name}
                        person={person}
                        index={index}
                        page={page}
                        onSelect={handleSelectPerson}
                        selectedPersonName={selectedPersonName}
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
        {selectedPersonName && (
          <div>
            <button
              onClick={handleCloseDetails}
              style={{ marginBottom: '8px' }}
            >
              X
            </button>
            <PersonDetails name={selectedPersonName} people={serverPeople} />
          </div>
        )}
      </div>
    </div>
  );
}
