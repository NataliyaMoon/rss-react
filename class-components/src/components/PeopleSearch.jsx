import React from "react";
import "./PeopleSearch.css";

class PeopleSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      people: [],
      page: 1,
      count: 0,
      loading: false,
    };
  }

  componentDidMount() {
    this.fetchPeople();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.query !== this.state.query ||
      prevState.page !== this.state.page
    ) {
      this.fetchPeople();
    }
  }

  fetchPeople = () => {
    const { query, page } = this.state;
    this.setState({ loading: true });

    const baseUrl = "https://swapi.py4e.com/api/people/";
    const url = `${baseUrl}?search=${encodeURIComponent(query)}&page=${page}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          people: data.results || [],
          count: data.count || 0,
          loading: false,
        });
      })
      .catch(() => this.setState({ loading: false }));
  };

  handleInputChange = (e) => {
    this.setState({ query: e.target.value, page: 1 });
  };

  handlePrev = () => {
    if (this.state.page > 1) {
      this.setState({ page: this.state.page - 1 });
    }
  };

  handleNext = () => {
    const maxPage = Math.ceil(this.state.count / 10);
    if (this.state.page < maxPage) {
      this.setState({ page: this.state.page + 1 });
    }
  };

  render() {
    const { people, query, page, count, loading } = this.state;

    return (
      <div className="people-search">
        <input
          id="input-id"
          type="text"
          placeholder="Search people..."
          value={query}
          onChange={this.handleInputChange}
        />
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {people.map((person) => (
              <li key={person.url}>{person.name}</li>
            ))}
          </ul>
        )}
        <div>
          <button onClick={this.handlePrev} disabled={page === 1}>
            Prev
          </button>
          <span>
            {" "}
            Page {page} of {Math.max(1, Math.ceil(count / 10))}{" "}
          </span>
          <button
            onClick={this.handleNext}
            disabled={page >= Math.ceil(count / 10)}
          >
            Next
          </button>
        </div>
      </div>
    );
  }
}

export default PeopleSearch;
