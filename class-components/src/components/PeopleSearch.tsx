import React from 'react';
import './PeopleSearch.css';
import ErrorBoundary from './ErrorBoundary';
import CrashComponent from './CrashComponent';

type Person = {
  name: string;
  birth_year: string;
  url: string;
};

type PeopleSearchState = {
  query: string;
  people: Person[];
  page: number;
  count: number;
  loading: boolean;
  error: string;
  forceError: boolean;
};

class PeopleSearch extends React.Component<unknown, PeopleSearchState> {
  constructor(props: unknown) {
    super(props);
    const savedQuery = localStorage.getItem('peopleSearchQuery') || '';
    this.state = {
      query: savedQuery,
      people: [],
      page: 1,
      count: 0,
      loading: false,
      error: '',
      forceError: false,
    };
  }

  componentDidMount() {
    this.fetchPeople();
  }

  fetchPeople = () => {
    const { query, page } = this.state;
    this.setState({ loading: true, error: '' });

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
        this.setState({
          people: data.results || [],
          count: data.count || 0,
          loading: false,
        });
      })
      .catch((error: unknown) => {
        const message =
          error instanceof Error ? error.message : 'Something went wrong.';
        this.setState({ loading: false, error: message });
      });
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ query: e.target.value });
  };

  handleSearch = () => {
    const trimmed = this.state.query.trim();
    localStorage.setItem('peopleSearchQuery', trimmed);
    this.setState({ page: 1, query: trimmed }, this.fetchPeople);
  };

  handlePrev = () => {
    if (this.state.page > 1) {
      this.setState({ page: this.state.page - 1 }, this.fetchPeople);
    }
  };

  handleNext = () => {
    const maxPage = Math.ceil(this.state.count / 10);
    if (this.state.page < maxPage) {
      this.setState({ page: this.state.page + 1 }, this.fetchPeople);
    }
  };

  handleResetError = () => {
    this.setState({ forceError: false });
  };

  render() {
    const { people, query, page, count, loading, error, forceError } =
      this.state;

    return (
      <div className="people-search">
        <section className="search-bar">
          <input
            type="text"
            placeholder="Search people..."
            value={query}
            onChange={this.handleInputChange}
          />
          <button onClick={this.handleSearch}>Search</button>
          <button onClick={() => this.setState({ forceError: true })}>
            Throw Error
          </button>
        </section>

        <section className="results">
          <ErrorBoundary onReset={this.handleResetError}>
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
                      <button onClick={this.handlePrev} disabled={page === 1}>
                        Prev
                      </button>
                      <span>
                        Page {page} of {Math.max(1, Math.ceil(count / 10))}
                      </span>
                      <button
                        onClick={this.handleNext}
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
}

export default PeopleSearch;
