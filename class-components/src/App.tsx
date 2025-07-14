import React from 'react';
import PeopleSearch from './components/PeopleSearch';
import './App.css';

type AppState = {
  visible: boolean;
};

class App extends React.Component<unknown, AppState> {
  state: AppState = { visible: true };

  toggle = () => this.setState({ visible: !this.state.visible });

  render() {
    return (
      <main className="main">
        <header className="header">
          <h1>Class-components</h1>
          <button onClick={this.toggle}>
            {this.state.visible ? 'Hide' : 'Show'}
          </button>
        </header>
        {this.state.visible && <PeopleSearch />}
      </main>
    );
  }
}

export default App;
