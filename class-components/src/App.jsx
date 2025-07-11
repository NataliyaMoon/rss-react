import React from "react";
import PeopleSearch from "./components/PeopleSearch";
import "./App.css";

class App extends React.Component {
  state = { visible: true };

  toggle = () => this.setState({ visible: !this.state.visible });

  render() {
    return (
      <main className="main">
        <h1>Class-components</h1>
        <button onClick={this.toggle}>
          {this.state.visible ? "Hide" : "Show"}
        </button>
        {this.state.visible && <PeopleSearch />}
      </main>
    );
  }
}

export default App;
