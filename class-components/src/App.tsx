import React from 'react';
import PeopleSearch from './components/PeopleSearch';
import './App.css';

type AppState = {
  visible: boolean;
  forceError: boolean;
};

class App extends React.Component<unknown, AppState> {
  state: AppState = { visible: true, forceError: false };

  toggle = () => this.setState({ visible: !this.state.visible });

  render() {
    if (this.state.forceError) {
      throw new Error('App crashed intentionally!');
    }

    return (
      <main className="main">
        <header className="header">
          <h1>Class-components</h1>
          <button onClick={this.toggle}>
            {this.state.visible ? 'Hide' : 'Show'}
          </button>
          <button onClick={() => this.setState({ forceError: true })}>
            Throw Error
          </button>
        </header>
        {this.state.visible && <PeopleSearch />}
      </main>
    );
  }
}

export default App;
